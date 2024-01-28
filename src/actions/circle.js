import help from "../help";
import interaction from '../interaction.js';
import snap from './../snap.js';
import canvas from './../canvas.js';
import drawing from './../drawing.js';
import mouse from './../mouse.js';
import tool from './../tool.js';
import convert from './../coords.js';

export default function Circle(){

    help(interaction.text + " center point of a circle")
    this.points = 0;
    this.coords = {};
    this.coords.type = "circle";
  
    this.click = function(x, y) {
      this.points = this.points + 1;
      if (this.points === 1) {
        help(interaction.text + " to set circle radius");
      } else if (this.points === 2) {
        help(interaction.text + " to set the radius")
      } else if (this.points === 3) {
        this.save();
        this.reset();
      }
    };
  
    this.reset = function() {
      tool.change(new Circle());
      drawing.refresh();
      tool.move(mouse.x, mouse.y);
    };
  
    this.move = function(x, y) {
      var snapped;
      if (this.points === 0) {
        snapped = snap(x, y);
        this.coords.x = snapped.x;
        this.coords.y = snapped.y;
      } else if (this.points === 1) {
        snapped = snap(x, y, this.coords.x, this.coords.y);
        this.coords.r = Math.round(Math.sqrt(Math.pow(snapped.x - this.coords.x, 2) + Math.pow(snapped.y - this.coords.y, 2)) * 1000) / 1000;
        canvas.f.beginPath();
        canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI, true);
        canvas.f.moveTo(this.coords.x, this.coords.y);
        canvas.f.lineTo(snapped.x, snapped.y);
        canvas.f.stroke();
  
      } else if (this.points === 2) {
        canvas.f.beginPath();
        canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI, false);
        canvas.f.stroke();
        var d = this.coords.b - this.coords.a;
        document.getElementById("coords").innerHTML = convert(d + " rad");
      }
      canvas.f.beginPath();
      canvas.f.arc(this.coords.x, this.coords.y, this.coords.r, 0, 2 * Math.PI, false);
      canvas.f.fill();
    };
  
    this.save = function() {
      var selectedColor = document.getElementById('line_color').value;
      if (selectedColor) {
        this.coords.color = selectedColor;
      }
      this.coords.width = document.getElementById('line_width').value;
      drawing.addItem(this.coords);
      drawing.addSnap([this.coords.x, this.coords.y]);
      drawing.addSnap([this.coords.x + this.coords.r * Math.cos(this.coords.a), this.coords.y + this.coords.r * Math.sin(this.coords.a)]);
      drawing.addSnap([this.coords.x + this.coords.r * Math.cos(this.coords.b), this.coords.y + this.coords.r * Math.sin(this.coords.b)]);
      mouse.hide();
    };
}