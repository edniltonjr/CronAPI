const makebuscarCartoesDisponiveis = ({ login, senha, cpf, codigoEntidade, sequencialOrgao }) => 
`<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.econsig.bmg.com">
<soapenv:Header/>
<soapenv:Body>
   <web:buscarCartoesDisponiveis soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="web:CartaoDisponivelParameter">
        <login xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${login}</login>
        <senha xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${senha}</senha>
         <codigoEntidade xsi:type="xsd:int">${codigoEntidade}</codigoEntidade>
        <sequencialOrgao xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${sequencialOrgao}</sequencialOrgao>
         <cpf xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${cpf}</cpf>
      </param>
   </web:buscarCartoesDisponiveis>
</soapenv:Body>
</soapenv:Envelope>`

module.exports = makebuscarCartoesDisponiveis