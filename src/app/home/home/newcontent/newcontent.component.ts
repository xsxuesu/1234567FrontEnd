import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { News } from '../../../class/news';
import { Comment } from '../../../class/comment';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-newcontent',
  templateUrl: './newcontent.component.html',
  styleUrls: ['./newcontent.component.css'],
  providers:[HttpService,LoadJQService]
})
export class NewcontentComponent implements OnInit {
  news:News;
  id:string;
  commentAvatorName:string;
  commentrepid:string;
  curComment:Comment;
  commentList:Comment[] = [];
  commentContent:string;
  isSelfForum:boolean = false;
  constructor(private route:ActivatedRoute,
    private httpService:HttpService,
    private loadJqService:LoadJQService) {
      this.news = new News();
      this.curComment  = new Comment();
      this.commentContent = "";
     }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.id = params["id"];
        if(this.id != undefined){
          this.httpService.getNewsById(this.id).then(resp=>{
            if(resp){
              console.log(resp);
              this.news = resp;
              // 判断是否是自己的帖子
              if (this.news.author == window.localStorage.getItem("username")){
                  this.isSelfForum = true;
              }
              this.isSelfForum = false;
            }
          });
          //  获得帖子的评论
          this.httpService.getComment(this.id).then(resp=>{
            console.log(resp);
            this.commentList = resp;
          })
        }
    }) 
  }

ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJqService.froalaEditorComment('forumComment');
    this.loadJqService.froalaEditorComment('Commentconent');
    
  }
  addAttention(username){
    const folwjson = {"username":window.localStorage.getItem("username"),"followusername":username};
    console.log(folwjson);
    this.httpService.createFollow(folwjson).then(resp=>{
      if(resp.success){
        $.notify(resp.message, {
              type: 'success'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
      }else{
        $.notify(resp.message, {
              type: 'warning'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
      }
    });
  }
  replyComment(id,name){
    this.commentrepid = id;
    this.commentAvatorName = name;
  }
  support()
  {
    this.httpService.supportNewsById(this.id).then(resp=>{
      if(resp.success){
        $.notify("成功收到您的赞", {
              type: 'success'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
      }
    });
  }
  supportComment(id){
    console.log(id);
    this.httpService.supportCommentById(id).then(resp=>{
      if(resp.success){
        $.notify("成功收到您的赞", {
              type: 'success'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
      }
    });
  }
// 提交reply
repSubmit(){
  // this.commentContent = $("#Commentconent").froalaEditor('html.get', true);
    if($("#Commentconent").froalaEditor('html.get', true)==undefined || $("#Commentconent").froalaEditor('html.get', true) == ""){
      $.notify("请输入评论内容", {
              type: 'warning'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
    }

    this.curComment.content = $("#Commentconent").froalaEditor('html.get', true);
    this.curComment.author = window.localStorage.getItem("username");
    this.curComment.issueTime = new Date();
    this.curComment.parentId = this.commentrepid;
    this.httpService.createComment(this.curComment).then(resp=>{
      this.curComment = new Comment();
      $('#Commentconent').froalaEditor('html.set', '');//清空回复内容
      $('#commentbymodal').modal('hide'); //隐藏modal
      // 获得帖子的评论
      this.httpService.getComment(this.id).then(resp=>{
        this.commentList = resp;
      })
    })
  };

  // 提交评论
  submitComment(){
    this.commentContent = $("#forumComment").froalaEditor('html.get', true);
    if(this.commentContent==undefined || this.commentContent == ""){
      $.notify("请输入评论内容", {
              type: 'warning'
            }, {
                animate: {
                  enter: 'animated lightSpeedIn',
                  exit: 'animated lightSpeedOut'
                }
              });
      return;
    }
    console.log(this.commentContent);
    this.curComment.content = this.commentContent;
    this.curComment.author = window.localStorage.getItem("username");
    this.curComment.issueTime = new Date();
    this.curComment.parentId = this.id;
    this.httpService.createComment(this.curComment).then(resp=>{
      this.curComment = new Comment();
      this.commentContent = "";
      $('#forumComment').froalaEditor('html.set', '');
      // 获得帖子的评论
      this.httpService.getComment(this.id).then(resp=>{
        this.commentList = resp;
      })
    })
  }
}