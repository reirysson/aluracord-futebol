import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import CustomBtn from "../components/CustomBtn";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import { UserContext } from "../context/UserContext";
import NextImagem from "next/image";
import IconeDeletar from '../imagens/deletar.svg';


const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage(){
  const roteamento = useRouter();
  const [mensagem, setMensagem] = React.useState("");
  const [listaMensagem, setListaMensagem] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { userName } = React.useContext(UserContext);
  const [deletaMensagem, setDeletaMensagem] = React.useState("");

  function escutaMensagens(addNovaMensagem) {
    return supabaseClient
      .from("mensagens")
      .on("INSERT", async (data) => {
        addNovaMensagem(data.new);
      })
      .subscribe();
  }

  function escutaMensagemDeletada(handleDeleteMensagem) {
    return supabaseClient
      .from("mensagens")
      .on("DELETE", async (date) => {
        handleDeleteMensagem(date);
      })
      .subscribe();
  }

  const handleDeleteMensagem = (mensagem) => {
    const mensagemDeletada = listaMensagem.filter(
      (mensagemId) => mensagemId.id !== mensagem
    );
    setListaMensagem(mensagemDeletada);
  };

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaMensagem(data);
      });
    escutaMensagens((date) => {
      setListaMensagem((valorAtual) => {
        return [date, ...valorAtual];
      });
    });
  }, [listaMensagem]);

  const handleNovaMensagem = (novaMensagem) => {
    const mensagem = {
      de: userName,
      texto: novaMensagem,
    };
    if (mensagem.texto !== "") {
      supabaseClient
        .from("mensagens")
        .insert([mensagem])
        .then(({ data }) => {});
      setMensagem("");
    } else {
      alert("Você não digitou nenhuma mensagem jogador");
    }
  };

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2022/02/stadio-friuli-1536x864.jpg)',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          wordBreak: "break-all",
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            wordWrap: "break-word",
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaMensagem}
            setListaMensagem={setListaMensagem}
            loading={loading}
            userName={userName}
            escutaMensagemDeletada={escutaMensagemDeletada}
            superbase={supabaseClient}
            deletaMensagem={handleDeleteMensagem}
            setDeletaMensagem={setDeletaMensagem}
          />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Fale sobre futebol aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker: ${sticker}`);
              }}
            />
            {/*CallBack*/}
            <Button
              disabled={!mensagem}
              onClick={() =>{
                if(mensagem.trim() !== '') handleNovaMensagem(mensagem)
                else setListaMensagem('');
              }}
              iconName="paperPlane"
                        rounded="none"
                        buttonColors={{
                          contrastColor: `${appConfig.theme.colors.primary[500]}`,
                          mainColor: `${appConfig.theme.colors.neutrals[600]}`,
                          mainColorLight: `${appConfig.theme.colors.neutrals[600]}`,
                          mainColorStrong: `${appConfig.theme.colors.neutrals[900]}`
                        }}
                        styleSheet={{
                            borderRadius: '50%',
                            padding: '0 3px 0 0',
                            minWidth: '50px',
                            minHeight: '50px',
                            fontSize: '20px',
                            margin: '0 8px',
                            lineHeight: '0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
            >
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Bate-papo</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Sair"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({
  mensagens,
  userName,
  escutaMensagemDeletada,
  superbase,
  setDeletaMensagem,
}) {
  return (
    <Box
    tag="ul"
    styleSheet={{
      overflow: "scroll",
      overflowX: "hidden",
      display: "flex",
      wordWrap: "break-word",
      flexDirection: "column-reverse",
      flex: 1,
      color: appConfig.theme.colors.neutrals["000"],
      marginBottom: "16px",
      wordWrap: "break-word",
    }}
    >
      {mensagens.map((mensagem) => {
        return (
          <>
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: "5px",
                padding: "6px",
                marginBottom: "12px",
                wordWrap: "break-word",
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                },
              }}
            >
              <Box
                styleSheet={{
                  display: "flex",
                  marginBottom: "8px",
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">{mensagem.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date(mensagem.created_at).toDateString('pt-BR', {dateStyle: 'short',timeStyle: 'short'})}
                </Text>
                <CustomBtn
                  onClick={() => {
                    if (mensagem.de === userName) {
                      superbase
                        .from("mensagens")
                        .delete([mensagem])
                        .match({ id: `${mensagem.id}` })
                        .then(() => {});

                      escutaMensagemDeletada((mensagem) => {
                        console.log(mensagem.id);
                        handleDeleteMensagem(mensagem.id);
                      });
                    } else {
                      alert("Calma jogador que esse chute não é seu!");
                    }
                  }}
                >
                <IconeDeletar />
                </CustomBtn>
              </Box>
              {mensagem.texto.startsWith(":sticker:") ? (
                <Image src={mensagem.texto.replace(":sticker:", "")} 
                height='150px'
                width='150px'
                src={mensagem.texto.replace(':sticker:', '')}
                />
              ) : (
                mensagem.texto
              )}
            </Text>
          </>
        );
      })}
    </Box>
  );
}