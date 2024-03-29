import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PlaidVerifyIdentityEmailProps {
  url: string;
}

export const PlaidResetPasswordEmail = ({
  url,
}: PlaidVerifyIdentityEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'https://fsio.app/assets/exercicios.png'}
          alt="logo-fsio"
          style={logo}
        />
        <Text style={tertiary}>Reset de senha</Text>
        <Heading style={secondary}>
          Clique no botão para criar uma nova senha
        </Heading>

        <Link style={button} href={url}>
          Alterar senha
        </Link>

        <Text style={paragraph}>Não esperava este email?</Text>
        <Text style={paragraph}>
          Contate{' '}
          <Link href="mailto:contato@fsio.app" style={link}>
            contato@fsio.app
          </Link>{' '}
          Se você não solicitou este código.
        </Text>
      </Container>
    </Body>
  </Html>
);

PlaidResetPasswordEmail.PreviewProps = {
  url: 'https://fsio.app/reset-password?token=1234567890',
} as PlaidVerifyIdentityEmailProps;

export default PlaidResetPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  maxWidth: '360px',
  margin: '0 auto',
  padding: '68px 1rem 130px',
};

const logo = {
  margin: '0 auto',
};

const button = {
  backgroundColor: '#94ffb2e6',
  border: '0',
  borderRadius: '12px',
  color: '#000',
  display: 'block',
  fontFamily: 'HelveticaNeue-Bold,Helvetica,Arial,sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0',
  lineHeight: '20px',
  maxWidth: '200px',
  margin: '1rem auto',
  padding: '8px 12px',
  textAlign: 'center' as const,
  textDecoration: 'none',
};

const tertiary = {
  color: '#94ffb2e6',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  height: '16px',
  letterSpacing: '0',
  lineHeight: '16px',
  margin: '16px 8px 8px 8px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
};

const secondary = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
  margin: '8px auto',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#444',
  fontSize: '15px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  letterSpacing: '0',
  lineHeight: '23px',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
};

const link = {
  color: '#444',
  textDecoration: 'underline',
};

const footer = {
  color: '#000',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0',
  lineHeight: '23px',
  margin: '0',
  marginTop: '20px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};
