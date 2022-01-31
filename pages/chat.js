import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker} from '../src/components/ButtonSendSticker';


const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
console.log('key: ', SUPABASE_ANON_KEY);
console.log('url: ', SUPABASE_URL);
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionarMensagem){
  return supabaseClient
  .from('mensagens')
  .on('INSERT', (respostaLive) => {
      adicionarMensagem(respostaLive.new); 
  })
  .subscribe(); 
}

function handleDeletarMensagem (id) {
  supabaseClient
    .from('mensagens')
    .delete()
    .match({ id: id })
    .then (( data ) => {
      const listaDeMensagensFiltrada = listaDeMensagens.filter((mensagem) => {
        return mensagem.id != id;
      });
      setListaDeMensagens(listaDeMensagensFiltrada);
    });
    }


export default function ChatPage() {
  const roteamento = useRouter(); 
  const usuarioLogado = roteamento.query.username;
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);


  React.useEffect(() => {
          supabaseClient
          .from('mensagens')
          .select('*')
          .order('id', {ascending: false})
          .then(({data}) => {
              console.log('Dados da consulta:', data);
             setListaDeMensagens( data);
          });

  const subscription =  escutaMensagensEmTempoReal((novaMensagem) => {
    setListaDeMensagens((valorAtualDaLista) => {
    return [
    novaMensagem,
    ...valorAtualDaLista, 
    ]
    });     
    });

    return () => {
    subscription.unsubscribe();
    }
  }, []);

    function handleNovaMensagem(novaMensagem) {
            const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem,
        };
        supabaseClient
            .from('mensagens')
            .insert([
              mensagem
            ])
            .then(({data}) => {
              console.log('Criando mensagem: ', data);
            })
            setMensagem('');
    }

    function handlePressionar (e){
        if (e.key == 'Enter'){
            e.preventDefault();
            handleEnviarMensagem(mensagem);
        }
    }

    function handleEnviarMensagem (e){
        e.preventDefault();

        handlePressionar(mensagem);
    }


    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2022/01/dacia-arena-1536x864.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            {/*Aqui fica a caixa maior do chat*/}
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '60px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '60%',
                    maxWidth: '60%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                {/*Aqui fica a caixa menor do chat*/}
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '60px',
                        padding: '20px',
                    }}
                >
                      <MessageList mensagens={listaDeMensagens} handleDeletarMensagem={handleDeletarMensagem}/>
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {/*Aqui eu poderia usar igual fiz na página home, com a function*/}
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                setMensagem(event.target.value)
                            }}
                            onKeyPress={(event) => {
                                if (event.key == 'Enter') {
                                    event.preventDefault();
                                    if(mensagem.trim() !== '') handleNovaMensagem(mensagem)
                                    else setListaDeMensagens('');
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/*CallBack*/}
                        <ButtonSendSticker 
                          onStickerClick={(sticker) => {
                            handleNovaMensagem (`:sticker: ${sticker}`)
                          }}
                        />
                        <Button
                          disabled={!mensagem}
                          onClick={() => {
                            if(mensagem.trim() !== '') handleNovaMensagem(mensagem)
                            else setListaDeMensagens('');
                          }}
                          iconName="paperPlane"
                          rounded="none"
                          buttonColors={{
                            contrastColor: `${appConfig.theme.colors.primary[500]}`,
                            mainColor: `${appConfig.theme.colors.neutrals[800]}`,
                            mainColorLight: `${appConfig.theme.colors.neutrals[600]}`,
                            mainColorStrong: `${appConfig.theme.colors.neutrals[900]}`
                          }}
                          styleSheet={{
                            borderRadius: '50%',
                            padding: '0 3px 0 0',
                            minWidth: '50px',
                            minHeight: '50px',
                            fontSize: '20px',
                            lineHeight: '0',
                            margin: '0 8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                      />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Bate papo
        </Text>
        <Box styleSheet={{display: 'flex', alignItems: 'center'}}>
          <Image
            src={`https://github.com/reirysson.png`}
            styleSheet={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '8px',
              transition: 'ease .2s',
              hover: {
                width: '36px',
                height: '36px'
              }
            }}
          />
          <Button
            variant='tertiary'
            colorVariant='neutral'
            label='Sair'
            href="/"
          />
        </Box>
      </Box>
    </>
  )
}

function MessageList(props) {

    return (
      <Box
        tag="ul"
        styleSheet={{
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
          flex: 1,
          color: appConfig.theme.colors.neutrals["000"],
          marginBottom: '16px',
        }}
      >
        {props.mensagens.map((mensagem) => {
          return (
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }
              }}
            >
              <Box
                styleSheet={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Box>
                  <Image
                    styleSheet={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                    src={`https://github.com/${mensagem.de}.png`}
                  />
                  <Text tag="strong">
                    {mensagem.de}
                  </Text>
                  <Text
                    styleSheet={{
                      fontSize: '10px',
                      marginLeft: '8px',
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {(new Date().toLocaleDateString())}
                  </Text>
                </Box>
                <Box>   
                <Button
                    label="X"
                    onClick={() => {
                      handleDeletarMensagem(mensagem.id);
                    }}
                    styleSheet={{
                      background: 'none',
                      padding: '5px',
                      color: appConfig.theme.colors.primary[100],
                      hover: {
                        color: '#fff',
                      }
                    }}
                    buttonColors={{
                      contrastColor: appConfig.theme.colors.neutrals["000"],
                    }}
                  />
                </Box>    
                    </Box>
              {/*[Declarativo]*/}
              {/* Condicional: {mensagem.texto.startsWith(':sticker:).toString()}*/}
              {mensagem.texto.startsWith(':sticker:')
              ? (<Image src={mensagem.texto.replace(':sticker:', '')} />)
              : (mensagem.texto)}
              </Text>
          );
        })}
      </Box>
    )
  }