
import store from '../store'
import router from '../router'
import axios from 'axios'

class allLibs {
    // возвращает куки с указанным name,
    // или undefined, если ничего не найдено

    getCookie(name) {
        var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );
 
        if ( results )
          return ( unescape ( results[2] ) );
        else
          return undefined;
    }

    getZn() {
      var nowData = new Date();
      return "ZN_"+nowData.getDate()+"_"+nowData.getMonth()+"_"+nowData.getMilliseconds()+"_"+Math.floor(Math.random() * 1000);
    }

    loginUser(response, savePassword,password) {
    console.log(response.data);
          var d = new Date();
          
          d.setMilliseconds(d.getMilliseconds() + (parseInt(response.data.seans_length) * 60 * 60 * 1000)); 
          
        

          document.cookie = "servautorise="+response.data.mail+"; path=/; expires=" + d.toUTCString();
          document.cookie = "servtoken="+response.data.token+"; path=/; expires=" + d.toUTCString();
          
          localStorage.setItem('fio', response.data.fio); 
          localStorage.setItem('mail', response.data.mail); 
          localStorage.setItem('podrazdelenie', response.data.podrazdelenie); 
          localStorage.setItem('dolgnost', response.data.dolgnost); 
          localStorage.setItem('seans_length', response.data.seans_length); 
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('status', response.data.status);

          store.dispatch('chengeAutorise',  true);
          store.dispatch('chengeUserName',  response.data.fio);
          store.dispatch('chengeUserStatus',  response.data.status);

          if (savePassword) {
              d = new Date();
              d.setHours(d.getHours() + 5000);

              document.cookie = "userlogin="+response.data.mail+"; path=/; expires=" + d.toUTCString();
              document.cookie = "userpass="+password+"; path=/; expires=" + d.toUTCString();
          }

          router.push({ name: 'service' })
      
    }

    reloginUser() {
      document.cookie = "servautorise=0; path=/; max-age=0";
      document.cookie = "servtoken=0; path=/; max-age=0";
      
      

      axios.get(store.getters.REST_API_PREFIX + 'relogin',
      {
          params: {
              mail: localStorage.getItem('mail') 
          }
      })
      .then( () => {})
      .catch(() => {});
  

      localStorage.removeItem('fio'); 
      localStorage.removeItem('mail'); 
      localStorage.removeItem('podrazdelenie'); 
      localStorage.removeItem('dolgnost'); 
      localStorage.removeItem('seans_length'); 
      localStorage.removeItem('token');
      localStorage.removeItem('status');

      store.dispatch('chengeAutorise',  false);
      
      router.push({ name: 'login' })
    }
}

let alllibs = new allLibs();

export default alllibs
