import { Component } from '@angular/core';  
import { NavParams, ViewController } from 'ionic-angular';  
import { LoginService } from '../../services/signin.service';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {  
    public signin: any = {};
    public isNew = true;
    public action = 'Add';
    public isoDate = '';

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams,
        private LoginService: LoginService) {
    }

    ionViewDidLoad() {
        let editsignin = this.navParams.get('signin');

        if (editsignin) {
            this.signin = editsignin;
            this.isNew = false;
            this.action = 'Edit';
            
        }
    }

    save() {
        this.signin.Date = new Date(this.isoDate);
        if (this.isNew) {
            this.LoginService.add(this.signin)
                .catch(console.error.bind(console));
        } else {
            this.LoginService.update(this.signin)
                .catch(console.error.bind(console));
        }

        this.dismiss();
    }

    delete() {
        this.LoginService.delete(this.signin)
            .catch(console.error.bind(console));

        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss(this.signin);
    }
}