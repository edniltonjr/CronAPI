const makecalcularSeguro = ({
  login,
  senha,
  cpf,
  codigoEntidade,
  limiteRenda,
  sequencialOrgao,
}) => `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.econsig.bmg.com">
<soapenv:Header/>
<soapenv:Body>
    <web:calcularSeguro soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="web:CalculoSeguroParameter">
      <login xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${login}</login>
      <senha xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${senha}</senha>
       <codigoEntidade xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${codigoEntidade}</codigoEntidade>
          <codigoSeguro xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">5</codigoSeguro>
          <cpf xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${cpf}</cpf>
          <limiteRenda xsi:type="soapenc:double" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${limiteRenda}</limiteRenda>
          <sequencialOrgao xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${sequencialOrgao}</sequencialOrgao>
      </param>
    </web:calcularSeguro>
</soapenv:Body>
</soapenv:Envelope>`;

module.exports = makecalcularSeguro;
