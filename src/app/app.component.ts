import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService, private toastr: ToastrService){
    translate.setDefaultLang('es');
    moment.locale('es');
  }

  ngDoCheck(): void {
    moment.locale(navigator.language.slice(0,2));
    this.translate.use(navigator.language.slice(0,2));
  }
}
