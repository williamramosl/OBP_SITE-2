// Dados institucionais centralizados. Tudo que aparece em mais de um lugar do site mora aqui.

export const company = {
  name: 'Office Brasil Print',
  legalId: 'CNPJ 33.860.649/0001-31',
  // Telefone e WhatsApp usam o mesmo número.
  phoneDisplay: '(27) 99816-3029',
  phoneHref: 'tel:+5527998163029',
  whatsappHref: 'https://wa.me/5527998163029',
  // TODO: confirmar se o contato público é comercial@ ou suporte@.
  email: 'comercial@officebrasilprint.com.br',
  // Destino do formulário de contato (FormSubmit). O site antigo enviava para suporte@.
  formEmail: 'suporte@officebrasilprint.com.br',
  mapsHref: 'https://maps.app.goo.gl/vtvzbSEq4jEt7yZC9',
  clientAreaHref: '/area-do-cliente/',
  // Portal anterior (PWS/iLux), mantido como alternativa enquanto a nova Área do Cliente é implantada.
  legacyClientAreaHref: 'https://psfx.com.br/pws/index.php/pws',
  social: {
    instagram: 'https://www.instagram.com/officebrasilprint/',
    linkedin: 'https://www.linkedin.com/in/jayme-obp-4a9456196/',
  },
};

export const nav = [
  { label: 'Soluções', href: '/solucoes/' },
  { label: 'Empresa', href: '/empresa/' },
  { label: 'Contato', href: '/contato/' },
];
