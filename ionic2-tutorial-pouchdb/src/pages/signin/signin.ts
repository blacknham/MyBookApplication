import { Component, NgZone } from "@angular/core";
import { ModalController, NavController, Platform } from 'ionic-angular';  
import { LoginService } from '../../services/signin.service';  
import { DetailsPage } from '../details/details';  

@Component({
  selector: 'page-home',
  templateUrl: 'signin.html'
})
export class HomePage {  
    public signins = [];

    constructor(private loginService: LoginService,
        private nav: NavController,
        private platform: Platform,
        private zone: NgZone,
        private modalCtrl: ModalController) {

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.loginService.initDB();

            this.loginService.getAll()
                .then(data => {
                    this.zone.run(() => {
                        this.signins = data;
                    });
                })
                .catch(console.error.bind(console));
        });
    }

    showDetail(signin) {
        let modal = this.modalCtrl.create(DetailsPage, { signin: signin });
        modal.present();
    }
    
}