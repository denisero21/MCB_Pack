import { ViewService } from 'src/app/shared/services/view.service';
import { Subscription } from 'rxjs';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit, OnDestroy {

  aSub: Subscription = null;
  stay: boolean = false;
  login: string = '';
  password: string = '';

  constructor(
    private auth : AuthService,
    private router: Router,
    private dataService: DataService,
    private viewService: ViewService
  ) {}

  ngOnInit() {}

  SignIn(){
    if(this.login != '' && this.password != ''){
      const user = {
        login: this.login,
        password: this.password
      };
      try {
        this.aSub = this.auth.Login(user).subscribe((data) => {
          if(data.token === null){
            alert('Неверный логин или пароль, повторите попытку');
            return;
          }
          else if(data.token === 'not found'){
            alert('Пользователь с таким логином не найден, зарегистрируйтесь');
            return;
          }
          else{
            alert('Успешный вход');
            if(data.user.favorites === null){
              data.user.favorites = [];
            }
            const User = {
              token: data.token,
              _id: data.user._id,
              login: data.user.login,
              password: data.user.password,
              isAdmin: data.user.isAdmin,
              isModer: data.user.isModer,
              favorites: data.user.favorites
            }
            if(this.stay){
              this.dataService.SetUser(User);
            }
            else{
              this.dataService.SetUserSession(User);
            }
            this.viewService.ChangeMessage(User);
            this.router.navigateByUrl('home');
          }
        });
      } catch (err) {
        console.log(err);
        return;
      }
    }
    else{
      alert('Заполните все поля ввода!');
    }
  }

  ChangeStay(){
    this.stay = !this.stay;
  }

  ngOnDestroy(){
    if(this.aSub !== null){
      this.aSub.unsubscribe();
    }
  }
}
