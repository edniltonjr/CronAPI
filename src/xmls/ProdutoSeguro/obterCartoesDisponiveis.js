const makeObterCartoesDisponiveis = ({
  login,
  senha,
  cpf,
}) => `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.econsig.bmg.com">
<soapenv:Header/>
<soapenv:Body>
   <web:obterCartoesDisponiveis soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="web:ListaCartoesSeguroParameter">
      <login xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${login}</login>
      <senha xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${senha}</senha>
         <codigoSeguro xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">5</codigoSeguro>
         <cpf xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${cpf}</cpf>
         <tipoPagamento xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">1</tipoPagamento>
      </param>
   </web:obterCartoesDisponiveis>
</soapenv:Body>
</soapenv:Envelope>`;

module.exports = makeObterCartoesDisponiveis;
