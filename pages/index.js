import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import {useRouter} from 'next/router';
import appConfig from '../config.json'

function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['000']};
                    font-size: 24px;
                    font-weight: 600;
                }
                `}</style>
        </>
    );
}


export default function PaginaInicial() {
    const [username, setUsername] = React.useState('reirysson');
    const roteamento = useRouter();

    let caracterebaixo=username.length > 2;

    //console.log(roteamento);

    return (
        <>
            {/*Fundo*/}
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2022/01/dacia-arena-1536x864.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
            {/*Caixa do centro*/}
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '120px', padding: '20px', margin: '20px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 80%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }}
                >
            {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (infosDoEvento){
                            infosDoEvento.preventDefault();
                            console.log('Alguém submeteu o form');
                            roteamento.push(`/chat?username=${username}`);
                            window.location.href ='/chat';
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Fala torcedor!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            Pronto para um bate papo?
                        </Text>

                        {/*<input 
                            type="text"
                            value={username}
                            onChange={function (event){
                                console.log('Usuário digitou', event.target.value);
                                // Onde está o valor que temos onde o usuário digitou?
                                const valor = event.target.value;
                                // Trocando o valor da variável username
                                // Isso através do React
                                setUsername(valor);
                            }}
                        />*/}

                        <TextField
                            value={username}
                            onChange={function (event){
                                console.log('Usuário digitou', event.target.value);
                                // Onde está o valor que temos onde o usuário digitou?
                                const valor = event.target.value;
                                // Trocando o valor da variável username
                                // Isso através do React
                                setUsername(valor);
                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />

                        {/*Botões*/}
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            disabled={!caracterebaixo}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[800],
                                mainColorLight: appConfig.theme.colors.primary[800],
                                mainColorStrong: appConfig.theme.colors.primary[400],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '20px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '100px',
                            flex: 1,
                            minHeight: '250px',
                        }}
                    >
                        {
                         caracterebaixo && ( 
                         <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={`https://github.com/${username}.png`}
                        /> 
                            )                       
                        }   
                        
                        <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {username}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}

