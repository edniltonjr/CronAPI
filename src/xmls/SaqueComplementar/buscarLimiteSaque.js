const makebuscarLimiteSaque = ({ login, senha, cpf, codigoEntidade, matricula, sequencialOrgao, numeroContaInterna, tipoSaque, tipoSeguro }) => 
`<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.econsig.bmg.com">
<soapenv:Header/>
<soapenv:Body>
   <web:buscarLimiteSaque soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="web:DadosCartaoParameter">
      <login xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${login}</login>
      <senha xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${senha}</senha>
         <codigoEntidade xsi:type="xsd:int">${codigoEntidade}</codigoEntidade>
         <sequencialOrgao xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${sequencialOrgao}</sequencialOrgao>
         <cpf xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${cpf}</cpf>
         <matricula xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${matricula}</matricula>
         <numeroContaInterna xsi:type="xsd:long">${numeroContaInterna}</numeroContaInterna>
         <tipoSaque xsi:type="xsd:int">${tipoSaque}</tipoSaque>
         <codigoTipoSeguro xsi:type="xsd:int">${tipoSeguro}</codigoTipoSeguro>
      </param>
   </web:buscarLimiteSaque>
</soapenv:Body>
</soapenv:Envelope>`

module.exports = makebuscarLimiteSaque