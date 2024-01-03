import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adm-page',
  templateUrl: './adm-page.component.html',
  styleUrls: ['./adm-page.component.scss']
})
export class AdmPageComponent implements OnInit {

  routerChild = false

  constructor(private actRouter: ActivatedRoute){}

  ngOnInit(): void {
    this.routerChild = !!this.actRouter.parent

    console.log(this.actRouter)

    
  }
}
