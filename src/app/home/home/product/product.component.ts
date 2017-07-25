import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Product } from '../../../class/product';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[HttpService,LoadJQService]
})
export class ProductComponent implements OnInit {
  productid:string;
  modalTitle:string;
  productInfo:any = {};
  gallerys :string[] = [];
  constructor(private httpService :HttpService,
    private route:ActivatedRoute,
    private loadJQService:LoadJQService
    ) { }

  

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.productid = params["id"];
        this.httpService.getProductById(this.productid).then(resp=>{
            console.log(resp);
            if(resp.success){
              this.productInfo = resp.data;
              var keys = new Array();
              var values = new Array();
              if(this.productInfo["config"]){
                for(var i=0;i<Object.keys(this.productInfo["config"]).length;i++){
                      keys.push(Object.keys(this.productInfo["config"])[i]);
                      values.push(this.productInfo["config"][Object.keys(this.productInfo["config"])[i]]);

                }
                this.productInfo["configkeys"] = keys;
                this.productInfo["configvalues"] = values;
              }
            }
        });
    });
  }
  ngAfterViewInit() {

  }
  showGallery(type:string,index:Number){
    if(type == "appear"){
        this.modalTitle = "外观图片";
        this.gallerys = this.productInfo["appearimages"];
    }else{
      this.modalTitle = "细节图片";
        this.gallerys = this.productInfo["detailimages"];
    }
    $('#imagegallery').modal('show');
  }
}
