import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../Model/Postagem';
import { Tema } from '../Model/Tema';
import { User } from '../Model/User';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  postagem: Postagem = new Postagem
  listaPostagens: Postagem[]
  postagemAtivo: boolean = true

  tema: Tema = new Tema
  listaTemas: Tema[]
  idTema: number

  user: User = new User()
  nomeUser = environment.nome
  emailUser = environment.email
  idUser = environment.id

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  token = {
    headers: new HttpHeaders().set('Authorization', environment.token)
  }

  ngOnInit() {
    window.scroll(0,0)

    if(environment.token == ''){
      this.router.navigate(['/login'])           
    }

    this.getAllTemas()
    this.getAllPostagens()
    this.findByIdUser()

    this.user.nome = environment.nome
    this.user.id = environment.id
    this.user.foto = environment.foto
    this.user.email = environment.email
    
  }

  getAllPostagens(){
    this.postagemService.getAllPostagens().subscribe((resp: Postagem[])=>{
      this.listaPostagens = resp
    })
  }

  findByIdUser(){
    this.authService.getById(this.idUser).subscribe((resp: User)=>{
      this.user = resp
console.log("FIND ID - ",this.user.id)
console.log("FIND ID - ",this.user.nome)
console.log("FIND ID - ",this.user.email)
console.log("FIND ID - ",this.user.foto)
    })
  }

  findByEmailUser(){
    this.authService.getByEmailUser(this.emailUser).subscribe((resp: User)=>{
      this.user = resp
    })
  }

  findByNomeUser(){
    this.authService.getByNomeUser(this.nomeUser).subscribe((resp: User)=>{
      this.user = resp
    })
  }

  findByIdTema(){
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema)=>{
      this.tema = resp
    })
  }

  getAllTemas(){
    this.temaService.getAllTema().subscribe((resp: Tema[])=>{
      this.listaTemas = resp
    })
  }

  publicar(){
    this.tema.id = this.idTema
    this.postagem.tema = this.tema
    this.postagem.ativo = this.postagemAtivo
    this.postagem.usuario = this.user

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) =>{
      this.postagem = resp
      alert('Postagem realizada com sucesso!')
      this.postagem = new Postagem()
      this.getAllPostagens()
      this.findByIdUser()
    })
  }
}
