var _countriesStates = [
  {
    countryCode: 'CA',
    states: [
      {"short":"AB","name":"Alberta","country":"CA"},
      {"short":"BC","name":"British Columbia","country":"CA"},
      {"short":"MB","name":"Manitoba","country":"CA"},
      {"short":"NB","name":"New Brunswick","country":"CA"},
      {"short":"NL","name":"Newfoundland and Labrador","country":"CA","alt":["Newfoundland","Labrador"]},
      {"short":"NS","name":"Nova Scotia","country":"CA"},
      {"short":"NU","name":"Nunavut","country":"CA"},
      {"short":"NT","name":"Northwest Territories","country":"CA"},
      {"short":"ON","name":"Ontario","country":"CA"},
      {"short":"PE","name":"Prince Edward Island","country":"CA"},
      {"short":"QC","name":"Quebec","country":"CA"},
      {"short":"SK","name":"Saskatchewan","country":"CA"},
      {"short":"YT","name":"Yukon","country":"CA"}
    ]
  },
  {
    countryCode: 'US',
    states: [
      {"short":"AL","name":"Alabama","country":"US"},
      {"short":"AK","name":"Alaska","country":"US"},
      {"short":"AZ","name":"Arizona","country":"US"},
      {"short":"AR","name":"Arkansas","country":"US"},
      {"short":"CA","name":"California","country":"US"},
      {"short":"CO","name":"Colorado","country":"US"},
      {"short":"CT","name":"Connecticut","country":"US"},
      {"short":"DC","name":"District of Columbia","country":"US"},
      {"short":"DE","name":"Delaware","country":"US"},
      {"short":"FL","name":"Florida","country":"US"},
      {"short":"GA","name":"Georgia","country":"US"},
      {"short":"HI","name":"Hawaii","country":"US"},
      {"short":"ID","name":"Idaho","country":"US"},
      {"short":"IL","name":"Illinois","country":"US"},
      {"short":"IN","name":"Indiana","country":"US"},
      {"short":"IA","name":"Iowa","country":"US"},
      {"short":"KS","name":"Kansas","country":"US"},
      {"short":"KY","name":"Kentucky","country":"US"},
      {"short":"LA","name":"Louisiana","country":"US"},
      {"short":"ME","name":"Maine","country":"US"},
      {"short":"MD","name":"Maryland","country":"US"},
      {"short":"MA","name":"Massachusetts","country":"US"},
      {"short":"MI","name":"Michigan","country":"US"},
      {"short":"MN","name":"Minnesota","country":"US"},
      {"short":"MS","name":"Mississippi","country":"US"},
      {"short":"MO","name":"Missouri","country":"US"},
      {"short":"MT","name":"Montana","country":"US"},
      {"short":"NE","name":"Nebraska","country":"US"},
      {"short":"NV","name":"Nevada","country":"US"},
      {"short":"NH","name":"New Hampshire","country":"US"},
      {"short":"NJ","name":"New Jersey","country":"US"},
      {"short":"NM","name":"New Mexico","country":"US"},
      {"short":"NY","name":"New York","country":"US"},
      {"short":"NC","name":"North Carolina","country":"US"},
      {"short":"ND","name":"North Dakota","country":"US"},
      {"short":"OH","name":"Ohio","country":"US"},
      {"short":"OK","name":"Oklahoma","country":"US"},
      {"short":"OR","name":"Oregon","country":"US"},
      {"short":"PA","name":"Pennsylvania","country":"US"},
      {"short":"RI","name":"Rhode Island","country":"US"},
      {"short":"SC","name":"South Carolina","country":"US"},
      {"short":"SD","name":"South Dakota","country":"US"},
      {"short":"TN","name":"Tennessee","country":"US"},
      {"short":"TX","name":"Texas","country":"US"},
      {"short":"UT","name":"Utah","country":"US"},
      {"short":"VT","name":"Vermont","country":"US"},
      {"short":"VA","name":"Virginia","country":"US"},
      {"short":"WA","name":"Washington","country":"US"},
      {"short":"WV","name":"West Virginia","country":"US"},
      {"short":"WI","name":"Wisconsin","country":"US"},
      {"short":"WY","name":"Wyoming","country":"US"},
      {"short":"AS","name":"American Samoa","country":"US"},
      {"short":"GU","name":"Guam","country":"US"},
      {"short":"MP","name":"Northern Mariana Islands","country":"US"},
      {"short":"PR","name":"Puerto Rico","country":"US"},
      {"short":"UM","name":"United States Minor Outlying Islands","country":"US"},
      {"short":"VI","name":"Virgin Islands","country":"US"},
    ]
  },
  {
    countryCode: 'MX',
    states: [
      {"name":"Aguascalientes","short":"AG","alt":["AGS"],"country":"MX"},
      {"name":"Baja California","short":"BC","alt":["BCN"],"country":"MX"},
      {"name":"Baja California Sur","short":"BS","alt":["BCS"],"country":"MX"},
      {"name":"Campeche","short":"CM","alt":["Camp","CAM"],"country":"MX"},
      {"name":"Chiapas","short":"CS","alt":["Chis","CHP"],"country":"MX"},
      {"name":"Chihuahua","short":"CH","alt":["Chih","CHH"],"country":"MX"},
      {"name":"Coahuila","short":"MX","alt":["Coah","COA"],"country":"MX"},
      {"name":"Colima","short":"CL","alt":["COL"],"country":"MX"},
      {"name":"Ciudad de México","short":"DF","alt":["DIF"],"country":"MX"},
      {"name":"Durango","short":"DG","alt":["Dgo","DUR"],"country":"MX"},
      {"name":"Guanajuato","short":"GT","alt":["Gto","GUA"],"country":"MX"},
      {"name":"Guerrero","short":"GR","alt":["Gro","GRO"],"country":"MX"},
      {"name":"Hidalgo","short":"HG","alt":["Hgo","HID"],"country":"MX"},
      {"name":"Jalisco","short":"JA","alt":["Jal","JAL"],"country":"MX"},
      {"name":"Mexico","short":"ME","alt":["Edomex","MEX"],"country":"MX"},
      {"name":"Michoacán","short":"MI","alt":["Mich","MIC"],"country":"MX"},
      {"name":"Morelos","short":"MO","alt":["Mor","MOR"],"country":"MX"},
      {"name":"Nayarit","short":"NA","alt":["Nay","NAY"],"country":"MX"},
      {"name":"Nuevo León","short":"NL","alt":["NLE"],"country":"MX"},
      {"name":"Oaxaca","short":"OA","alt":["Oax","OAX"],"country":"MX"},
      {"name":"Puebla","short":"PU","alt":["Pue","PUE"],"country":"MX"},
      {"name":"Querétaro","short":"QE","alt":["Qro","QUE"],"country":"MX"},
      {"name":"Quintana Roo","short":"QR","alt":["Q Roo","ROO"],"country":"MX"},
      {"name":"San Luis Potosí","short":"SL","alt":["SLP"],"country":"MX"},
      {"name":"Sinaloa","short":"SI","alt":["SIN"],"country":"MX"},
      {"name":"Sonora","short":"SO","alt":["SON"],"country":"MX"},
      {"name":"Tabasco","short":"TB","alt":["TAB"],"country":"MX"},
      {"name":"Tamaulipas","short":"TM","alt":["Tamps","TAM"],"country":"MX"},
      {"name":"Tlaxcala","short":"TL","alt":["Tlax","TLA"],"country":"MX"},
      {"name":"Veracruz","short":"VE","alt":["VER"],"country":"MX"},
      {"name":"Yucatán","short":"YU","alt":["YUC"],"country":"MX"},
      {"name":"Zacatecas","short":"ZA","alt":["ZAC"],"country":"MX"}
    ]
  }
];


app.value('countriesStates', _countriesStates);
