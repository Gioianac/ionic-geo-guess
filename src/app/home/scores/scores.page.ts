import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.page.html',
  styleUrls: ['./scores.page.scss'],
})

export class ScoresPage implements OnInit {

  users: User[];
  location: string;

  constructor(private http: HttpClient) {
    this.users = [];
    this.location = 'city';
  }

  ngOnInit() {
    const url = `${environment.apiUrl}/users`;
    this.http.get<User[]>(url).subscribe(data => {
      this.users = data;
      // Order by totalScore
      this.users.sort((a, b) => b.totalScore - a.totalScore);
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

}
