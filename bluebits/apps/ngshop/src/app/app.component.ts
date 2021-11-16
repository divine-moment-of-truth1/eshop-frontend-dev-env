import { Component, OnInit } from '@angular/core';
import { UsersService } from '@bluebits/users';

@Component({
  selector: 'ngshop-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(private usersService: UsersService) {

    }

    title = 'ngshop';

    ngOnInit() {
        this.usersService.initAppSession();
    }

}
