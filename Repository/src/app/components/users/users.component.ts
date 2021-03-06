import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser } from 'src/app/shared/models/models';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

  users: IUser[] = [];
  currentUser: IUser = null;
  newIsAdmin: boolean = null;
  newIsModer: boolean = null;
  userToEdit: IUser = null;

  uSub: Subscription = null;
  dSub: Subscription = null;
  rSub: Subscription = null;

  constructor(
    private reqService: RequestsService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.currentUser = this.dataService.DecryptUser();
    this.uSub = this.reqService.GetUsers().subscribe((data) => {
      this.users = data;
    });
  }

  ngOnDestroy() {
    if(this.uSub !== null){
      this.uSub.unsubscribe();
    }
    if(this.dSub !== null){
      this.dSub.unsubscribe();
    }
    if(this.rSub !== null){
      this.rSub.unsubscribe();
    }
  }

  DeleteUser(user: IUser){
    this.dSub = this.reqService.DeleteUser(user).subscribe((data) =>{
      if(data.message === 'Deleted'){
        alert('Пользователь удален');
        this.ngOnDestroy();
        this.ngOnInit();
      }
      else{
        alert('Ошибка на стороне серера, попробуйте позже');
      }
    });
  }

  SelectUser(user: IUser){
    this.userToEdit = user;
    this.newIsAdmin = this.userToEdit.isAdmin;
    this.newIsModer = this.userToEdit.isModer;
  }

  ChangeAdmin(){
    this.newIsAdmin = !this.newIsAdmin;
  }

  ChangeModer(){
    this.newIsModer = !this.newIsModer;
  }

  ChangeUser(){

    const user = {
      _id: this.userToEdit._id,
      isAdmin: this.newIsAdmin,
      isModer: this.newIsModer,
      favorites: this.currentUser.favorites
    }

    if(this.userToEdit.isAdmin === this.newIsAdmin && this.userToEdit.isModer === this.newIsModer){
      alert('Вы ничего не изменили');
      return;
    }
    else{
      try {
        this.rSub = this.reqService.ChangeUser(user).subscribe((data) => {
          if(data.message === 'Updated'){
            alert('Пользователь обновлён');
            this.userToEdit = null;
            this.ngOnDestroy();
            this.ngOnInit();
            return;
          }
          else{
            alert('Ошибка на стороне серера, попробуйте позже');
            return;
          }
        }, (err) => {
          console.log(err);
          return;
        });
      } catch (err) {
        console.log(err);
        return;
      }
    }
  }

}
