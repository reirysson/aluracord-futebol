import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import next from "next";
import { UserContext } from "../context/UserContext";

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
    const {userName, setUsername} = React.useContext(UserContext);
    const roteamento = useRouter();
    const caracterebaixo =
        userName.length > 2
        ? `https://github.com/${userName}.png`
        : "https://i.ibb.co/VtCKnBD/loading-perfil.gif"

    {/*let caracterebaixo=userName.length > 2;*/}


    return (
        <>
            {/*Fundo*/}
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2022/02/stadio-friuli-1536x864.jpg)',
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
                        borderRadius: '5px', padding: '32px', margin: '20px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 80%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }}
                >
            {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (userName.length > 2) roteamento.push(`/chat`);
                            else alert("Esse jogador não joga aqui!");
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '30px',
                        }}
                    >
                        <Titulo tag="h2">Fala torcedor!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            Pronto para um bate papo?
                        </Text>
                        <TextField
                            value={userName}
                            onChange={function (event){
                                console.log('Usuário digitou', event.target.value);
                                const valor = event.target.value;
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
                            justifyContent: 'center',
                            maxWidth: '200px',
                            padding: '20px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '5px',
                            flex: 1,
                            minHeight: '250px',
                        }}
                    >
                        {
                         caracterebaixo && ( 
                         <Image
                            styleSheet={{
                                padding: '0px',
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={caracterebaixo}
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
                            {userName}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}

