function openLogin(){
document.getElementById("loginModal").style.display="flex";
}

function closeLogin(){
document.getElementById("loginModal").style.display="none";
}

function login(){
let role=document.getElementById("role").value;
if(role==="admin"){
window.location="admin.html";
}else{
window.location="dashboard.html";
}
}

function daftar(){
let data={
nama:document.getElementById("nama").value,
nisn:document.getElementById("nisn").value,
asal:document.getElementById("asal").value,
jalur:document.getElementById("jalur").value
};

let users=JSON.parse(localStorage.getItem("users"))||[];
users.push(data);
localStorage.setItem("users",JSON.stringify(users));

alert("Data Berhasil Disimpan!");
window.location="dashboard.html";
}

function loadUser(){
let users=JSON.parse(localStorage.getItem("users"))||[];
if(users.length>0){
document.getElementById("userNama").innerText=users[users.length-1].nama;
}
new Chart(document.getElementById("userChart"),{
type:'bar',
data:{
labels:['Proses','Lulus','Tidak Lulus'],
datasets:[{data:[1,0,0]}]
}
});
}

function loadAdmin(){
let users=JSON.parse(localStorage.getItem("users"))||[];
document.getElementById("totalUser").innerText=users.length;

new Chart(document.getElementById("adminChart"),{
type:'doughnut',
data:{
labels:['Zonasi','Prestasi','Afirmasi'],
datasets:[{
data:[
users.filter(u=>u.jalur==="Zonasi").length,
users.filter(u=>u.jalur==="Prestasi").length,
users.filter(u=>u.jalur==="Afirmasi").length
]
}]
}
});
}

function logout(){
window.location="index.html";
}
