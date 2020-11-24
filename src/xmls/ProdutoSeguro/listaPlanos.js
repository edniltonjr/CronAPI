const makelistaPlanos = ({
  login,
  senha,
  codigoOrgao,
  codigoProdutoSeguro,
  entidade,
  matricula,
  numeroInternoConta,
  renda,
  tipoPagamentoSeguro,
}) => `<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.econsig.bmg.com">
<soapenv:Header/>
<soapenv:Body>
   <web:listaPlanos soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="web:PlanosSeguroParameter">
         <login xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${login}</login>
         <senha xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${senha}</senha>
         <codigoOrgao xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${codigoOrgao}</codigoOrgao>
         <codigoProdutoSeguro xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${codigoProdutoSeguro}</codigoProdutoSeguro>
         <entidade xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${entidade}</entidade>
         <matricula xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${matricula}</matricula>
         <numeroInternoConta xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${numeroInternoConta}</numeroInternoConta>
         <renda xsi:type="soapenc:double" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${renda}</renda>
         <tipoPagamentoSeguro xsi:type="soapenc:int" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">${tipoPagamentoSeguro}</tipoPagamentoSeguro>
      </param>
   </web:listaPlanos>
</soapenv:Body>
</soapenv:Envelope>`;

module.exports = makelistaPlanos;
