import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AdvertsService } from '../services/adverts.service';

const DELETE_ADVERT = gql`
mutation ($idAdvert: ID){
  deleteAdvert(
     id: $idAdvert
   )
 }
  `;

const ADVERT_BY_USER = gql`
  query advertsByUser($idAdvert: ID){
    advertsByUser(id: $idAdvert) {
  id,
  description,
  address,
  published,  
  price,
  guests,
  bedrooms,
  bathrooms,
  beds,
  user {
    name
  }
}
}
`;

@Component({
  selector: 'app-my-adverts',
  templateUrl: './my-adverts.page.html',
  styleUrls: ['./my-adverts.page.scss'],
})
export class MyAdvertsPage implements OnInit {
  adverts: any[];

  constructor(private apollo: Apollo, private router: Router, private advertService: AdvertsService) { }

  ngOnInit() {
    this.getAdverts();
  }

  ionViewWillEnter() {
    this.getAdverts();
  }

  getAdverts() {
    this.apollo
      .watchQuery({
        query: ADVERT_BY_USER,
        variables: {
          idAdvert: 1,
        },
      })
      .valueChanges.subscribe((result: any) => {
        this.adverts = result.data.advertsByUser;
      });
  }



  updateAdvert(id: number) {
    this.router.navigateByUrl("/update-advert");
    this.advertService.setCurrentAdvertId(id);
  }

  createAdvert() {
    this.router.navigateByUrl("/create-advert");
  }

  deleteAdvert(id: number) {
    this.apollo.mutate({
      mutation: DELETE_ADVERT,
      variables: {
        idAdvert: id
      }
    }).subscribe(() => {
      this.getAdverts();
    });
  }

}
