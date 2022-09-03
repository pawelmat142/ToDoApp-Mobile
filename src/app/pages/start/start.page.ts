import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }
  
  get logged(): boolean {
    return !!this.userService.user
  }
}
