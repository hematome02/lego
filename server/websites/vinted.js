const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
  const fs = require('fs');

  /**
   * Parse webpage data response
   * @param  {String} data - html response
   * @return {Object} deal
   */
  const parse = data => {

    //Récupération des variables (titre, URL, price, favourite) sur Vinted
    const result = data.items.map((item) =>({
        //console.log(item.title);
        titre:item.title,
        //console.log(item.url);
        lienURL:item.url,
        //console.log(item.price.amount);
        price:item.price.amount,
        //console.log(item.favourite_count)
        favourite:item.favourite_count, 
        image : new Date(item.photo.high_resolution.timestamp*1000).toLocaleDateString()//item.photo.high_resolution.timestamp
        //ew Date(sales[i].image*1000).toLocaleDateString()
    }));

    return result; 
      
    };

  /**
 * Scrape a given url page
 * @param {String} url - url to parse
 * @returns 
 */

module.exports.scrape = async (url) => {
  const cookies  = await Cookie();
  const response = await fetch(url, {
    method: 'GET', // Optionnel, car GET est le comportement par défaut
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'fr',
      //'Set-Cookie': "_vinted_fr_session=aDFvYnRDc21VcFRwY0piZUg4L2MyNVFWL0t1aUFSSlF1SjZrakUveWRIUnJIdWNhUTZWV2RnLzNXNjMrQkROZ1pFRWtNZFl0YzlUZG9pWDlENFNEa0d6UXJJSE1laXJkemhiTkVFZ3hEVTlnYlVpdlRuU3BIU2FwRyttY3Z5eUwvRTZHNWQwdzZsaFF3UlBmM1grMXZVbVF5NzJna1NicFZ4VURkZWZMbU90YTRQWUErZE9WaSs4ZXN6ajlESDBOa2tWbWxlTzJoWDNwVU1yemJHQVZsVXdSSXlsMVZEWUVEWjUzLzdnNUFSdFk2Q1lxeWdFeUpGS1I2b1BUblJhdE50R3ZvU2Y2cXR0OFRjMi9EM3NCYk5VbWFNRWF3bEppRThWSm45aXYxTHhPd05INEdSR3RWU2I1TWxSRWVmeGJRRDJMWldKU1RUVm9hNXlUSEZReUhSdHhSWWI1Rks5a2VGOW5jb1hDTmdDME1SYkNYMmtTVU9pWDhUTm04eWQxV3NoRmF3bXI4Yjh0dzlDVGVIV29XSW1OQWlRR21XcnY0RzFWK3ZEWStpSUg5bkxGQUkxVmlaSm1vU2M1NnBURmNVRG9VOUlGa1A3U3ZSeElvR1ZzUXNUVUpHMEJEbHFCbnRDdXM1VGdjNklMd3BaV0ZpL1VTSVMwYXUwbEM0eUg1Sk41RmljYkZzazRuZHBrNUJHdFlFRDdBa0EvZndYdkYwWTZWcVY1ZUc5bGZZM1YzY08vRTQwVm1ER2pWVlU4cU91NDUrZGxIT1QxZmFEeTBESm9hSWRiaW1BVGdZMkgvdWM4U2s4UVFNL2lZVWVtMnNzdlE1SDBSL2YzdlovblBJWExleGhSZ0wrWnVHemNyeGtQaENkZUI2VFluYm1rSXh1dWwvRDN5ZVFFZ0NUVGtuUXpjUVZGRmwxM3hkNmxRRk1IUXFOYUZxazArUTV2Vzg1aXk4WW5uUE9Nb01STmNuUlZvK2tlODlQMVMzK0hzR1lNSkcvM0xQMlFEelkyNjRvcGRKbkpyajJPeHl2U2NLbzR6M2JxR0c2NjRJZ2ZvSXNacGtqZUVyTURiNDV2eVFKQ1BBRTRQbTVJQ3pXR2wvL1NqLzZvQmpjK2xvZXZFMkxmc1IzQ0lwR2NlWEZjSXVJM3YrclVZZlphaVU5QWNGclJ3b3RDeFJmdGdZZVVVWVpFSXFxREl2SFUzaG5pcDlGY2N0TVhhbGoxYlFySnVXYzJNZ3pxN29DMGdORXR6QVFQTTdOa1Z3eHp6SmZhOGU0azMrR3VyNUZVOGhBMk05bGYxamZHL2tmV2RDeUFRK0doMXdWZ3RiOVA1aSsxbnlMQ0RFdUEzMlVFV0FqQ0NxTjFiUVdPdC93M1ZaeUhjOVE3K1pqa3ovY1F6TUhvR1ZXMFl3aUs5YmRGbU16NzRyWmdKbVVCaDNYWlB2bEQrcFpxaExiZDkrbFZJMXpaRU1RcHl6d3Y1dG1WNGZHNjNXcThpdFFLMnZ5VW10ZWtaeHViMnJaT0JwUEkrRWRrUTJBSDd3TFBQSnZZdlNNY2x2N09UNmhwOW15Ymo4QmlrOUJmU0JBSVVHNHVLZlpORTkwMDNscHZEOWt5amJXbXpBUWd3WDR2ZGwxOFIrUHF0MFJNWTdRSDl6V2tjUEJRMEc1cWhMZnp2eStJdjNXSFhJWHllYUNzRWZiUTVxR2NXOWsweU9ZWCtjZkN5bkRkQ1M0c1V6SGlQN25UcW14UnZtQVVjc0MrMFc2NmhmZ1JGbUJSME83NlowNHFzWlBBOUROWk1xRFh1ZVpzKzRubXB5SnEyNEY1c2Y0ZWtGcjJsazlBdWs0VUNZVjk5Rkh6QVNlODVuMlFlYlpvMTVWWFNFOXNBMVR1QU1MbFhxWmd4SFVvZFJsVmswWjJPOTZJengvVjRJRWV6M0ZrbGI2OFJUaUVua0Y4eVVuZFlWK2o5ckFVRUpneUVOdWV0dDdXZjVleTRwS05GUmppQmFkbGV3aGlVSzFZb1E0WTV0d0o2eGRRTGpvWkd0MVdjTlM0M2ZuYkVKZGU2UmJrV29Tam85TDBpV1FOQnN5TFhTV0YxNUFYRmQ5c1VyTVVxT0k1Y0JuNnNiUGRYZFJLdDZhOEo2L1BoTVRyUU93bDZwb0NCODB4QXhIVm04d3kyMlZ5aXV6aGN4YVEvS1h1ams0VzljNVEwYTZ1RmpUTzcrb2VCMDJjS2ZjREpFUmYvY0xzb2NnMEh4ZnJNNkk1cXpZR0hENmFBaVFmR2VHY3B2Ky8zVmV5VXBzcjVqUENEQUk3LS1SU2Q5S1M0eTVxVnRnRnUzYTNsTFp3PT0%3D--30e42e18151e0e324aca7498cd03591bfafb4fac; domain=.www.vinted.fr; path=/; expires=Tue, 26 Nov 2024 13:41:28 GMT; secure; HttpOnly; SameSite=Lax",
      'Referer': "https://www.vinted.fr/catalog?brand_ids[]=89162&page=1&search_text=76434",
      'Connection': "keep-alive",
      "x-csrf-token":"75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
      "Cookie": cookies, 
      //"v_udt=aTV6VEhhMWR5Y211bFpVRGdIbWxET01FYk5sSS0tSWpyWjIwNlppcG5OMlRjeS0teHQrejlOaHRXS1VxTmEwcTBpd2JGdz09; ab.optOut=This-cookie-will-expire-in-2025; OptanonAlertBoxClosed=2024-11-18T15:40:35.472Z; eupubconsent-v2=CQISJZgQISJZgAcABBENBPFgAAAAAAAAAChQAAAAAAFBIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBhwDKAMsAbIA74B7AHxAPsA_QCAAEUgIuAjABGgCggFQAKuAXMAxQBogDaAG4AOIAh0BIgCdgFDgKPAUiApsBbAC5AF3gLzAYaAyQBk4DLgGcwNYA1kBsYDbwG6gOCAcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3SB5IHlAPkAfuBAQCBkEEQQTAgwBCsCFw4BgAAiABwAHgAXABIAD8ANAA5wB3AEAgIOAhABEQCfgFQAL0AdIBHoCRQErAJiATKAm0BSACkwFdgLUAXQAxABiwDIQGTANGAaaA1MBrwDaAG2ANuAcfA50Dn4HkgeUA-IB9sD9gP3AgeBBECDAEGwIVjoJQAC4AKAAqABwAEAALoAZABqADwAIgATAAqwBcAF0AMQAbwA9AB-gEMARIAlgBNACjAGGAMoAaIA2QB3gD2gH2AfoA_4CKAIwAUEAq4BYgC5gF5AMUAbQA3ABxADqAIdAReAkQBMgCdgFDgKPgU0BTYCrAFigLYAXAAuQBdoC7wF5gL6AYaAx4BkgDJwGVQMsAy4BnIDVQGsANvAbqA4sByYDlwHjgPaAfWBAECFpAAmAAgANAA5wCxAI9ATaApMBeQDUwG2ANuAc_A8kDygHxAP2AgeBBgCDYEKyEB4ABYAFAAXABVAC4AGIAN4AegBHADvAH-ARQAlIBQQCrgFzAMUAbQA6kCmgKbAWKAtEBcAC5AGTgM5AaqA8cCFAELSUCEABAACwAKAAcAB4AEQAJgAVQAuABigEMARIAjgBRgDZAHeAPwAq4BigDqAIdAReAkQBR4CxQFsALzAZOAywBnIDWAG3gPaAgeSAHgAXAHcAQAAqACPQEigJWATaApMBiwDcgHlAP3AgiBBgpA3AAXABQAFQAOAAggBkAGgAPAAiABMACkAFUAMQAfoBDAESAKMAZQA0QBsgDvgH2AfoBFgCMAFBAKuAXMAvIBigDaAG4AQ6Ai8BIgCdgFDgKbAWKAtgBcAC5AF2gLzAX0Aw0BkgDJ4GWAZcAzmBrAGsgNvAbqA4IByYDxwHtAQhAhaUAQgAXABIAI4Ac4A7gCAAEiALEAa8A7YB_wEegJFATEAm0BSACnwFdgLoAXkAxYBkwDUwGvAPKAfFA_YD9wIGAQPAgmBBgCDYEKw.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=3268dd8d-1731944430; anonymous-locale=fr; anon_id=cb9d3ea0-aa7a-4ed8-a156-7bd3f3940d01; anon_id=cb9d3ea0-aa7a-4ed8-a156-7bd3f3940d01; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzMyMTIzOTgzLCJzaWQiOiIzMjY4ZGQ4ZC0xNzMxOTQ0NDMwIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3MzIxMzExODMsInB1cnBvc2UiOiJhY2Nlc3MifQ.DdZqtWuUfhVxloV0lqr2VHDAyO8UWYHIRpjCNpM9IzRKY16fPa3Z1dy0i1NpCIqdIb0k3sqKhMHQU63fAXjLqJ5_DEwhLyDkCXSiDkLn_Skz7ejF9mawB9tBrUMkLh5-JKjmzu0rt6XMaVE_-J_Lrjx-YnWjy4lgkc7Hmaseo8kXU8jSOavjJ0keNSXRm59guZLVwPEBEPyKCTtCHo_lX7dYJOFz_b_zUrxt4dPad1gK53a2LVDUHAQKu1mX93ZN2IYLAWTtO10M_1Flz2vjjnD9pcNi9hR4k1KcX18ezKsm69RARn7xtPzcx_J-oNkFvSRrY_7Ksk6-KDdQci0xLQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaWF0IjoxNzMyMTIzOTgzLCJzaWQiOiIzMjY4ZGQ4ZC0xNzMxOTQ0NDMwIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3MzI3Mjg3ODMsInB1cnBvc2UiOiJyZWZyZXNoIn0.Wvo_TaQGbtPQzpEEECLwBKkhfcy0gFGLH9QFUtvScgjfy5L-RSIQKbnLF-LsbjB9e2JriXDVHiTS8AnaQWO9vmxkTYPue3fK_9qRHEgziE0MzImcdxwwUFZWyf5olzM_j5IRt0p98Wic_Fv5sdCFQJjr__2YMO10HTRRJcA1UIbSj2d3POMN4myp0TZt_Ytu_5CVJ_Q3JHSKIsm303r6iEnG_VX-ksT74tFURPh1PAtjWfcbYZoF-CxPxqbMbQmksaQsNJe4g4O0LrzxhZUOaG7qNDNqViJ-9nO7T7psEiRRE23Zk5i15Q7L04IIFAM8NDFwqpFYt2p9Y3YNohf3xA; cf_clearance=zrHFvpKER6U.GPCcfYrU8bdp6BPzf2Gp8J9_vfGcT38-1732125477-1.2.1.1-ff4MXk1nTVSW2xz_AMLxhVKPRxbISbW71JyOSgIkUNOLR.8jKmqScuVIiX5dnJEKgSqe0YMrKFluNywlsh7vppEn7LbqDwEx0ateZ_xmOvIvD4CS0K400dxbJVAzQiNgxcFzN5NXSKSuomE2mEAJNRqM5nxdjnqqkBmnu1_LW8njbTb5MLUp6OFaZaPTgGttzEUIuyH6iDtf9S0NuKE0yN0q4QtIFaieeL5TcfqKr9R9aOcWdT1Ywb4RAtxlGoQNhAzCKRp3UnLz.nKb1os3NPWoPjGUgdGNuqxWojMhkTf1W9lWxzd0DoC0fNGKT8Kya4RXaJJpAt3lxI1SID_jh3iwLQ9FdvOBrYE02a9Kyu4ZuB0igtIHCnbnK9HEB4jo; viewport_size=170; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Nov+20+2024+18%3A58%3A25+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=cb9d3ea0-aa7a-4ed8-a156-7bd3f3940d01&interactionCount=24&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; datadome=172W3LaWzW1sFN2n0Ykoe4IERszYTCnF~Q0Ylcq4tPD29IdMOYP35kv31nVY7yknXi3gBc6Dro_l_jlGiICS07va2LP0S~dlQcjWDxR2dIG_8Mj4Z0oAB3X1fsxbpr1Y; _vinted_fr_session=VHlvZXlNSld2QVdkZUw3anF2Yzd6VWo2eTZQWS82eW9qanM0ckVxQmtiV0lFNzJrTitRT2F5NnZZZk5KZ1lnTCsyZ2lJV0JyVUI3dEpVUXptcTMrRXBmdmFnKy9mbVg1TmZROFh3WENqbWlndFl4MXRQanVibzQyR2pKOVl2WXRkcUdmaFhKTElxNUhvSXREQ2NhdWc1ekVOZzRGZFJGV2E3Q3NVVkhpSnRuKzIwZ3hVUmZLYWJRSTEveHhqODVYSFp5bTFCWlNLS3pGdEYraW9pMHlubEh1b002dk8yWUp1c2dya2hlQk5nSjVaYXdtYXNmNkJWQWtBUUFsb3FFdnA4SzlhVlp6NC9weXYrOWIwaGNWQ3BQdzgrL0NWSzJOeG9TeTdHZk45OTExdzZpMFRUaGF1andPTVNlRVlQeGpGaHhoREwrUVBSWGJQVytDeXhrSmd4aWxNQkVSTHMxcjJBQms0ZnZLaExtbnIyaWxYTmM5SFBObkN3dmlmQjBhY1ZIaks3TmFDT0lpWVF2S2JjcWlMUjljMEVxK25JWDdLeTUvQXNNa0l3OWJLU1I2eGpPY2syMWFoeU93clBtZ3JlQllVVE05RVUwT0dLWnljQy85V2FYV2dnYnFZV3gzZ3hIb0xNaE5DR1JLVFBGY2xKT1pWb0hoNVludzNKbFFiMTJLVDg0K25HRFhLY0xPWDBja295ZFlIMlgwc2plOUdqOTlBY2NCWHhlR09tNWg5aTFyeFNhNW1MV2pRcXR3eU16eEF1bWJWY3RUUFkxakpuQno3RHU2TDRWVzZ5RXFOaGdvTE1LTDJjK2loWE1TamloUGxhRjZYTDBSOGNnSUp1OHFTNzNkUS9RZkpRT2V6bXJpdE8wNFAzeEh2RVVmak94UENyMS9IMlFCRFR0NDIxeHF2U0RwQ2FTRm5vNDhSY0c2MFRuaTFHS3FLWTB6bWo0U2dMTXR2ckhBeENUdUt3blhzZFRzNmFTNWc4RUhJV1ozTmI4aC9RMW5TNWg3WDE2YzY1VnU1dmhGazFzWUdnbTZkNEdRTE8wcnRjVUI2blNmRktmbWlqZ3VockJGZ2lmeEZaNEpmV0R1TkdSZTM3SUYyUEVWNGFUcG5VN0lOakZCcUloZEZXSzd3dFk0U2doWGppVzBlZFVaWTRoRjc3RVRsVzZFMnhka3d5cU1RQ2dNSS9pOEJ3WVZNWFkvTmJKMXVkTHlXZS9uZ0VpektnYXhKNjVPM0pXWHN3Y3BCci81SG9CTkRVRWV2VUFJeGY2UlVzVjFYeWMyYkNjaDR5NnZiYTBmNklVdUt2a1daVEM2WkM3Q002a0g3TDU0M1greHoyRXkwcWtmV2Q3UkcwN3JlVlRPbkJxL1VpRzEvWlVqSGZsZ2dGOERnSXhjaEpINlZ0TG9kbDZ3aGtOc0FpNWNodnBFNTJpMlYvcC9xcVNrWXV3UGZ0SkdyOHV2clhoMGh0K21YVFRHUWtxWDlYNitJUyswY0svck5jcWVncU91UU9rV0N0bEZVZFFPNUNUa3Nlc3FlRHZyTm8wYUhDZ2FsOG1meWVYVFNvcDYvTkRSaThJRWw5MVlXdTJoY2h1M0llWFhYWkMvbTVtU1kxUGhnZFUyMFdaQVM4MGJVWjdqZ1ZveHE0QnpwY3hmR1dBc3g0a2xEd3VNMFIxKzdsd09iZkdIQjlNMlhCYXBaZmYvcnQ4VVBZNWY5a3F6cG5KZXpWVTNaSmRlR1NFQTNBVlBtcGt3QklDajY0T2p1NzZ3NHVqeWxENDFCZ2huaVdUZGc5VEFnaGxJbWJ6YkVZODRrTzBaTXVValZkQldQMUgzN3RKYm5WbHQvamEvY2VCQ1A3YVBwbWJ2ZFVPcGdyM1p1ekJoMXUrb3JMeHFkcS9tVmZPQXYvRy83ZFNtekptV0p5clZ4N1lxOGkyc1FUdkhRaXdCRUVlYlZxV3RINFd1VGQ2YVhGaE5pN1B3enZEVmVNMCtYd3M1bGM0MkE1TjJVb1kySHpDRmpaWmlLN3ZsekZWRkZQQzdmK0lJSjJoV0dLRWpwWXRBVU0xblBJMUlkdmlQKytsZFlzOFRqaWNtb2lyaDZwdW5TeG40ODVkdmJKZGF1MHoyY2lDcmNJa3dLR2t6eGxVRUJrWHZWbzMrWHNvOWV4NkxMTHd4SWQ5UVFHQkcwTG1ZWGx3eUZlZHpZQlJHdHQrNGpDSkJtSVNiaFAwekoyWGZFTXQ1MWFNZHlzdU42YkdkQTk0aDB6UDZNSllDaDkyaWJhSTJSVXZ4a0dDN3ExWG40RmRWLS0yallkV3c1T1BvVWJjNXZaZ1prNjNnPT0%3D--de7e69e1aae83a7d04c279db57d9a56adeeb9128; __cf_bm=SZrQ3ehw_HuQH.FqTZGasZHQDoTQ2_wsrAj3x_vjlcA-1732127105-1.0.1.1-Qr7aMbbsr8EVnx9nR92BnyIYOVALLFQLQjrGmZ2BQvAhxgkMJu_4s.BX_8cgDnTuOtpvpkYQr.H9rMt4MTTLU6fnudm.3jfWIb_EdplZdJA; _dd_s=rum=0&expire=1732128005494",
      // Ajoutez d'autres headers ici si nécessaire
    },
  });

  if (response.ok) {
    const body = await response.json();
    //console.log("body" , body);    
    console.log(`Vinted Data accessed`);
    const parsedData = await parse(body);
    //console.log(parsedData);

    return parsedData;
  }
  console.error(`Request failed with status ${response.status}-${response.statusText}`);
  return null;
};

//Fonction pour récuperer un nouveau cookie pour le scrapping de Vinted
async function Cookie() {
  const response1 = await fetch("https://www.vinted.fr/", {
    headers: {
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    },
  });
  if (!response1.ok) {
    console.error(`Initial request failed with status: ${response1.status}`);
    return [];
  }
  const cookies = response1.headers.get("set-cookie");
  return cookies;
}
