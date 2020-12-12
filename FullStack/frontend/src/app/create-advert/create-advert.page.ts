import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { AlertController } from '@ionic/angular';

const CREATE_ADVERT = gql`
mutation ($description: String, $address: String, $published: String, $price: Float, $guests: Int, $bathrooms: Int, $bedrooms: Int, $beds: Int){
  createAdvert(
    description: $description,
    address: $address,
    published: $published,
    price: $price,
    guests: $guests,
    bathrooms: $bathrooms,
    bedrooms: $bedrooms,
    beds: $beds,
    user: 1
   ){
    description address published price guests bathrooms bedrooms beds user {id}
   }
 }
  `;

@Component({
  selector: 'app-create-advert',
  templateUrl: './create-advert.page.html',
  styleUrls: ['./create-advert.page.scss'],
})
export class CreateAdvertPage implements OnInit {
  createAdvertForm: FormGroup;
  isSubmitted = false;

  constructor(private apollo: Apollo, public fb: FormBuilder, private router: Router, public alertController: AlertController) {
    this.createAdvertForm = this.fb.group({
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      guests: new FormControl('', Validators.required),
      bathrooms: new FormControl('', Validators.required),
      bedrooms: new FormControl('', Validators.required),
      beds: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }



  onFormSubmit() {
    if (!this.createAdvertForm.valid) {
      this.isSubmitted = true;
      return false;
    } else {
      this.apollo.mutate({
        mutation: CREATE_ADVERT,
        variables: {
          description: this.createAdvertForm.value.description,
          address: this.createAdvertForm.value.address,
          published: new Date().toISOString().split('T')[0],
          price: this.createAdvertForm.value.price,
          guests: this.createAdvertForm.value.guests,
          bathrooms: this.createAdvertForm.value.bathrooms,
          bedrooms: this.createAdvertForm.value.bedrooms,
          beds: this.createAdvertForm.value.beds,
          user: 1
        }
      }).subscribe((res) => {
        this.presentAlert();
        this.isSubmitted = false;
        this.createAdvertForm.reset();
        this.router.navigateByUrl("/my-adverts");
      });
    }
  }

  cancelAdvert() {
    this.router.navigateByUrl("/my-adverts");
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      message: 'Anuncio creado.',
      buttons: ['OK']
    });

    await alert.present();
  }

  login() {
    this.router.navigateByUrl("/log-in");
  }
}
