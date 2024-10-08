const { createBot, createProvider, createFlow, addKeyword, EVENTS} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path= require("path")
const fs= require("fs")
const { delay } = require('@whiskeysockets/baileys')

// Ruta a la imagen en tu equipo
//EXXABOT
const imagePath = path.join(__dirname, 'imagenes', 'exxa_bot.jpg')
// ALOJAMIENTO WEB
const h_plan_basico=path.join(__dirname,'imagenes','alojamiento_web','h_plan_basico.png')
const h_plan_eco=path.join(__dirname,'imagenes','alojamiento_web','h_plan_eco.png')
const h_plan_prof=path.join(__dirname,'imagenes','alojamiento_web','h_plan_prof.png')
//HOSTING RESELLER
const m_reseller=path.join(__dirname,'imagenes','hosting_reseller','m_reseller.png')
const i_reseller=path.join(__dirname,'imagenes','hosting_reseller','i_reseller.png')
const r_crece=path.join(__dirname,'imagenes','hosting_reseller','r_crece.png')
const r_pro=path.join(__dirname,'imagenes','hosting_reseller','r_pro.png')
const r_master=path.join(__dirname,'imagenes','hosting_reseller','r_master.png')
//ALOJAMIENTO VPS
const vps_basico=path.join(__dirname,'imagenes','alojamiento_vps','vps_basico.png')
const vps_prof=path.join(__dirname,'imagenes','alojamiento_vps','vps_prof.png')
const vps_ava=path.join(__dirname,'imagenes','alojamiento_vps','vps_ava.png')
const vps_ext=path.join(__dirname,'imagenes','alojamiento_vps','vps_ext.png')
const vps_ult=path.join(__dirname,'imagenes','alojamiento_vps','vps_ult.png')
//HOSTING MOODLE
const moodle=path.join(__dirname,'imagenes','hosting_moodle','moodle.png')
const moodle_s=path.join(__dirname,'imagenes','hosting_moodle','moodle_s.png')
const moodle_m=path.join(__dirname,'imagenes','hosting_moodle','moodle_m.png')
const moodle_l=path.join(__dirname,'imagenes','hosting_moodle','moodle_l.png')
const moodle_xl=path.join(__dirname,'imagenes','hosting_moodle','moodle_xl.png')
//CERTIFICADOS SSL
const ssl_1=path.join(__dirname,'imagenes','certificados_ssl','ssl_1.png')
const ssl_mul=path.join(__dirname,'imagenes','certificados_ssl','ssl_mul.png')
const ssl_wil=path.join(__dirname,'imagenes','certificados_ssl','ssl_wil.png')
//SERVIDOR DEDICADO
const serv_dedic=path.join(__dirname,'imagenes','servidor_dedicado','serv_dedic.png')
//FIRMAS ELECTRÓNICAS
const per_nat=path.join(__dirname,'imagenes','firma_electronica','per_nat.png')
const per_jur=path.join(__dirname,'imagenes','firma_electronica','per_jur.png')
//MENSAJERIA MASIVA
const imc_whats_pro=path.join(__dirname,'imagenes','mensajeria_masiva','imcwhatspro.png')

// Ruta para incluir archivos .txt
const msmpath=path.join(__dirname,"mensajes","bienvenida.txt")
const inicial=fs.readFileSync(msmpath,"utf8")

const path_soporte=path.join(__dirname,"mensajes","soporte.txt")
const soporte=fs.readFileSync(path_soporte,"utf8")

const path_ventas=path.join(__dirname,"mensajes","ventas.txt")
const ventas=fs.readFileSync(path_ventas,"utf8")

const path_catalogo=path.join(__dirname,"mensajes","catalogo.txt")
const catalogo=fs.readFileSync(path_catalogo,"utf8")
const num_productos = catalogo.split('\n').length;

const flowWelcome=addKeyword(EVENTS.WELCOME)
    .addAnswer(inicial,
        {delay:500,media:imagePath, capture:true},
        async(ctx,{gotoFlow, fallBack, flowDynamic})=>{
           
           if(!["1","2","3"].includes(ctx.body)){
                return gotoFlow(flowWelcome);
            }
            switch(ctx.body){
                case "1":
                    return gotoFlow(flowSoporte);
                case "2":
                    //await flowDynamic("Accediendo a la opcion 2")
                    return gotoFlow(flowAcliente);
                case"3":
                    return gotoFlow(flowVentas);
                    
            }
        }
    )

    const flowSoporte=addKeyword(EVENTS.ACTION)
        .addAnswer(soporte,{delay: 1000},async (ctx,{gotoFlow,inRef,endFlow}) => {
                   return gotoFlow(flowEspera);
                                               
                // 10 segundos de espera antes de enviar el tercer mensaje
                
            })
        

    const flowAcliente=addKeyword(EVENTS.ACTION)
        //.addAnswer("Un asesor se comunicara con usted en brevedad.")
        .addAction(async (ctx, {gotoFlow,flowDynamic}) => {
            // Primer mensaje después de 1 segundo
            setTimeout(async () => {
                await flowDynamic("Un asesor se comunicara con usted en brevedad.");
            }, 1000); // 5 segundos de espera antes de enviar el segundo mensaje
            setTimeout(async () => {
                await flowDynamic("Estamos asignando a un agente, por favor espere unos momentos.");
            }, 5000); // 5 segundos de espera antes de enviar el segundo mensaje
            
            // Segundo mensaje después de 15 segundos
            setTimeout(async () => {
                //await flowDynamic(A_cliente);
                return gotoFlow(flowEspera);
            }, 7000); // 10 segundos de espera antes de enviar el tercer mensaje
            
        })
    


    const flowVentas=addKeyword(EVENTS.ACTION)
        .addAnswer(ventas)
        .addAnswer(catalogo,
            {delay:1000,capture:true},
            async(ctx,{gotoFlow,fallBack,flowDynamic})=>{
                const num=Number(ctx.body)
                if(isNaN(num)){
                    await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números para acceder a nuestros productos/servicios.")
                    return gotoFlow(flowVentas)
                }
                

                switch (ctx.body){
                    case "1":
                        return gotoFlow(flowHost);
                    case "2":
                        return gotoFlow(flowVPS);
                    case "3":
                        return gotoFlow(flowMoodle);
                    case "4":
                        return gotoFlow(flowSSL);
                    case "5":
                        return gotoFlow(flowServDedic);
                    case "6":
                        return gotoFlow(flowSisCont);
                    case "7":
                        return gotoFlow(flowFirElec);
                    case "8":
                        return gotoFlow(flowMensMas);
                    default:
                        await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo")
                        return gotoFlow(flowVentas)
                }
            
            }
        )
        
//ALOJAMIENTO WEB 
    const flowHost=addKeyword(EVENTS.ACTION)
            .addAnswer("PLAN BÁSICO\n*1.-* Adquiri",{media:h_plan_basico })
            .addAnswer("PLAN ECONÓMICO\n*2.-* Adquiri",{media:h_plan_eco })
            .addAnswer("PLAN PROFESIONAL\n*3.-* Adquiri",{media:h_plan_prof })
            .addAnswer("*4.-* Deseas más información")
            .addAnswer("*0.-* Menú de ventas")
            .addAction({capture:true},
                async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                    
                const num=Number(ctx.body)
                if(isNaN(num)){
                    await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                    return fallBack(flowHost)
                }

                switch (ctx.body){
                    case "1":
                        return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/web-hosting/basico");
                    case "2":
                        return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/web-hosting/economico");
                    case "3":
                        return await flowDynamic("Acceda al siguiente link para continuar su compra:https://my.exxalink.com/index.php?rp=/store/web-hosting/profesional");
                    case "4":
                        return gotoFlow(flowAcliente);
                    case "0":
                        return gotoFlow(flowVentas);
                    default:
                        await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                        return fallBack(flowHost)
                    
                }


                }
            )

//ALOJAMIENTO VPS
    const flowVPS=addKeyword(EVENTS.ACTION)
    .addAnswer("PLAN VPS BÁSICO\n*1.-* Adquirir",{media:vps_basico})
    .addAnswer("PLAN VPS PROFESIONAL\n*2.-* Adquiri",{media:vps_prof})
    .addAnswer("PLAN VPS AVANZADO\n*3.-* Adquirir",{media:vps_ava})
    .addAnswer("PLAN VPS EXTREMO\n*4.-* Adquirir",{medi:vps_ext})
    .addAnswer("PLAN VPS ULTRA\n*5.-* Adquirir",{media:vps_ult})
    .addAnswer("*6.-* Desea más información")
    .addAnswer("*0.-* Menú de ventas")
    .addAction({capture:true},
        async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
            const num=Number(ctx.body)
            if(isNaN(num)){
                await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delar:100})
                return fallBack(flowVPS)
                
            }
            switch (ctx.body){
                case "1":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-virtuales-vps/vps-basico");
                case "2":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-virtuales-vps/vps-profesional");
                case "3":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-virtuales-vps/vps-avanzado");
                case "4":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-virtuales-vps/vps-extremo")
                case "5":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-virtuales-vps/vps-ultra")
                case "6":
                    return gotoFlow(flowAcliente);
                case "0":
                    return gotoFlow(flowVentas);
                default:
                    await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                    return fallBack(flowVPS)
                
            }

        }
    )

//HOSTING MOODLE
    const flowMoodle=addKeyword(EVENTS.ACTION)
    .addAnswer("PLAN MOODLE\n*1.-* Adquirir",{media:moodle})
    .addAnswer("PLAN MOODLE S\n*2.-* Adquirir",{media:moodle_s})
    .addAnswer("PLAN MOODLE M\n*3.-* Adquirir",{media:moodle_m})
    .addAnswer("PLAN MOODLE L\n*4.-* Adquirir",{media:moodle_l})
    .addAnswer("PLAN MOODLE XL\n*5.-* Adquirir",{media:moodle_xl})
    .addAnswer("*6.-* Desea más información")
    .addAnswer("*0.-* Menú de ventas")
    .addAction({capture:true},
        async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
            const num=Number(ctx.body)
            if(isNaN(num)){
                await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                return fallBack(flowMoodle)
                
            }
            switch (ctx.body){
                case "1":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/hosting-moodle/moodle");
                case "2":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/hosting-moodle/moodle-s");
                case "3":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/hosting-moodle/moodle-m");
                case "4":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/hosting-moodle/moodle-l")
                case "5":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/hosting-moodle/moodle-xl")
                case "6":
                    return gotoFlow(flowAcliente);
                case "0":
                    return gotoFlow(flowVentas);
                default:
                    await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                    return fallBack(flowMoodle)
                
            }

        }
    )
//CERTIFICADOS SSL
        const flowSSL=addKeyword(EVENTS.ACTION)
        .addAnswer("PLAN SSL1\n*1.-* Adquiri",{media:ssl_1 })
        .addAnswer("PLAN SSL MULTI DOMINIO\n*2.-* Adquiri",{media:ssl_mul })
        .addAnswer("PLAN SSL WILCARD\n*3.-* Adquiri",{media:ssl_wil })
        .addAnswer("*4.-* Deseas más información")
        .addAnswer("*0.-* Menú de ventas")
        .addAction({capture:true},
            async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                
            const num=Number(ctx.body)
            if(isNaN(num)){
                await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                return fallBack(flowSSL)
            }

            switch (ctx.body){
                case "1":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store");
                case "2":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store");
                case "3":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store");
                case "4":
                    return gotoFlow(flowAcliente);
                case "0":
                    return gotoFlow(flowVentas);
                default:
                    await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                    return fallBack(flowSSL)
                
            }


            }
        )
//SERVIDOR DEDICADO
        const flowServDedic=addKeyword(EVENTS.ACTION)
        .addAnswer("SERVIDOR DEDICADO\n*1.-* Adquirir",{media:serv_dedic})
        .addAnswer("*2.-* Deseas más información")
        .addAnswer("*0.-* Menú de ventas")
        .addAction({capture:true},
            async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                const num=Number(ctx.body)
            if(isNaN(num)){
                await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                return fallBack(flowSSL)
            }
            switch (ctx.body){
                case "1":
                    return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/index.php?rp=/store/servidores-dedicados");
                case "2":
                    return gotoFlow(flowAcliente);
                case "0":
                    return gotoFlow(flowVentas);
                default:
                    await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                    return fallBack(flowServDedic)
                
            }

            }
        )
//SISTEMA CONTABLE
        const flowSisCont=addKeyword(EVENTS.ACTION)
        .addAnswer("Desea comunicarse directamente co un accesor\n*1.-* SI\n*0.-* Menú de ventas")
        .addAction({capture:true},
            async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                const num=Number(ctx.body)
            if(isNaN(num)){
                await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                return fallBack(flowSSL)
            }
            switch (ctx.body){
                case "1":
                    return gotoFlow(flowAcliente)
                case "0":
                    return gotoFlow(flowVentas);
                default:
                    await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                    return fallBack(flowServDedic)
                
            }

            }
        )
//FIRMA ELECTRONICA
        const flowFirElec=addKeyword(EVENTS.ACTION)
        .addAnswer("PLAN PERSONA NATURAL\n*1.-* Adquirir",{media:per_nat})
        .addAnswer("PLAN PERSONA JURIDICA\n*2.-* Adquirir",{media:per_jur})
        .addAnswer("*3.-* Desea más información")
        .addAnswer("*0.-* Menú de ventas")
        .addAction({capture:true},
            async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                const num=Number(ctx.body)
                if(isNaN(num)){
                    await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                    return fallBack(flowSSL)
                }
                switch (ctx.body){
                    case "1":
                        return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/cart.php?a=confproduct&i=2");
                    case "2":
                        return await flowDynamic("Acceda al siguiente link para continuar su compra: https://my.exxalink.com/cart.php?a=confproduct&i=3")
                    case "3":
                        return gotoFlow(flowAcliente);
                    case "0":
                        return gotoFlow(flowVentas);
                    default:
                        await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                        return fallBack(flowFirElec)
                    
                }   
            }
        )
//MENSAJERIA MASIVA
        const flowMensMas=addKeyword(EVENTS.ACTION)
        .addAnswer("PLAN IMC WHATS PRO\n*1.-* Adquirir",{media:imc_whats_pro})
        .addAnswer("*2.-* Desea más información")
        .addAnswer("*0.-* Menú de ventas")
        .addAction({capture:true},
            async(ctx,{gotoFlow,flowDynamic,fallBack})=>{
                const num=Number(ctx.body)
                if(isNaN(num)){
                    await flowDynamic("Que mal, no entiendo esa orden, por favor usa solo números.",{delay:100})
                    return fallBack(flowSSL)
                }
                switch (ctx.body){
                    case "1":
                        return gotoFlow(flowAcliente);
                    case "2":
                        return gotoFlow(flowAcliente);
                    case "0":
                        return gotoFlow(flowVentas);
                    default:
                        await flowDynamic("Parece que la opción que escogiste no esta en mi lista, volvamos a intentarlo",{delay:100})
                        return fallBack(flowMensMas)
                    
                } 
            }
        )


        const flowEspera=addKeyword(EVENTS.ACTION)
        .addAction({capture:true,idle:900000},async (ctx,{gotoFlow,inRef}) => {
            // Primer mensaje después de 1 segundo
                //console.log("bot espera")
                if(ctx?.idleFallBack){
                    console.log("Se termina")
                    return gotoFlow(flowSalida);
                    
                }
                return gotoFlow(flowEspera);
                
            // 10 segundos de espera antes de enviar el tercer mensaje
            
        })
        const flowSalida=addKeyword(EVENTS.ACTION)
        .addAnswer("Muchas gracias por haberse comunicado con nosotros.",{capture:true},async (ctx,{gotoFlow}) => {
            return gotoFlow(flowWelcome)
        })
        
          


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome,flowAcliente,flowVentas,flowSoporte,flowHost,flowVPS,flowSSL,flowMoodle,flowServDedic,flowSisCont,flowFirElec,flowMensMas,flowEspera,flowSalida])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
