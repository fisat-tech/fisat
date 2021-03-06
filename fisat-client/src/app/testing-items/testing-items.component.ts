import { Component, OnInit,Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';



@Component({
  selector: 'app-testing-items',
  templateUrl: './testing-items.component.html',
  styleUrls: ['./testing-items.component.scss']
})


export class TestingItemsComponent implements OnInit {

  constructor(private dataservice:DataService,private modalService: NgbModal) { }
  @Input() in_compl;
  compl_details:any;
  @Input()  in_modu;
module_details:any;
  ngOnInit() {
  }

  openComp(compcontent) {
    alert("asdasd");
    //this.modalService.open()
    this.modalService.open(compcontent, {ariaLabelledBy: 'modal-register-title', size:'sm'}).result.then((result) => {
      
     }, (reason) => {
      
     });
   }
   
   
   
   onaddcomplaint(module:any,user:any){
      console.log("inside fun");
      console.log("error : "+this.in_compl);
      // this.modalService.open(module, {ariaLabelledBy: 'modal-feedback-title', size:'lg'}).result.then((result) => {
     
      //   console.log("inside fun");
      //console.log("error : ");
      this.compl_details={
           "complaintType":this.in_compl
            };
  // console.log("modder"+JSON.stringify(this.module_details));
  
  this.dataservice.insertComplaint(this.compl_details).subscribe(data=>{
    return true;
  })
  this.modalService.dismissAll();
   }


   openMod(content) {
    alert("asdasd");
      this.modalService.open(content, {ariaLabelledBy: 'modal-register-title', size:'sm'}).result.then((result) => {
      
     }, (reason) => {
      
     });
   }
   onaddmodule(module:any,user:any){
    console.log("inside fun");
    console.log("error : "+this.in_modu);
    // this.modalService.open(module, {ariaLabelledBy: 'modal-feedback-title', size:'lg'}).result.then((result) => {
   
    //   console.log("inside fun");
    //console.log("error : ");
    this.module_details={
         "moduleType":this.in_modu
          };
// console.log("modder"+JSON.stringify(this.module_details));
this.dataservice.insertModule(this.module_details).subscribe(data=>{
  return true;
})
this.modalService.dismissAll();
 }

}
