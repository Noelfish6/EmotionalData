var margin = {t:50,r:50,b:50,l:50};


var w = document.getElementById('canvas').clientWidth - margin.l - margin.r,
    h = document.getElementById('canvas').clientHeight - margin.t - margin.b;


var scaleColor = d3.scaleOrdinal()
      .range(["#F6EB9A", "#fda135", "#f9201f", "#c51124", "#fc715d", "#9673b9", "#7753d4", "#f769e2", "#5e7c7f", "#2ebec2", "#1979dc", "#a4e435"])
      .domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);

var emotionct=document.querySelector('#emotion');
var thingct=document.querySelector('#thing');
var whomct=document.querySelector('#whom');
var whom2ct=document.querySelector('#whom2');
var weatherct=document.querySelector('#weatherDes');



//animation for headline
  var texto = document.querySelector('.transition').innerHTML;
  document.querySelector('.transition').innerHTML = "";
  texto.split('').forEach(function(e){
    e = e == " " ? "&nbsp;" : e;
    var span = document.createElement('span');
    span.innerHTML = e;
    document.querySelector('.transition').appendChild(span);
  });




//circles
d3.csv('emotion.csv',parse,dataLoaded);

function dataLoaded(err,rows){
    
  var job = d3.nest()
      .key(function(d){return d.job})
      .entries(rows);

  var weather = d3.nest()
      .key(function(d){return d.job}) 
      .key(function(d){return d.weather})
      .entries(rows);

  var plot = d3.select('#canvas')
               .append('svg')
               .attr('width',w+margin.l+margin.r)
               .attr('height',h+margin.t+margin.b)
               .selectAll('g')
               .data(job)
               .enter()
               .append('g')
               .attr('transform', function(d, i) {
                  return 'translate('+((margin.l)+ 100)+','+(margin.t+i*43+20)+')';
              });

  var n = 50,
      frequency = 1/4,
      data = d3.range(n),
      time = 0;

var x, y,
    word = "apple",
    width = plot.attr("width"),
    height = plot.attr("height");



  d3.timer(function (){

    //circles
    var circles = plot.selectAll("g").data(function(d){ return d.values;}); // d.values = a bunch of data
    function calculateYPosition(i) {
      return (Math.sin(i * frequency + time)) * h/25; 
    }
    circles = circles
      .enter()
      .append("g")
      .merge(circles)
      .attr('transform', function(d, i){
        x = i*w/50;
        y = calculateYPosition(i);
        return "translate("+x+","+y+")";
      });      

    circles = circles.selectAll("circle").data(function(d){ return [d]; }); // [d] = individual data

    //text
    var texts = plot.selectAll("text").data(function(d){
      // Filter the letter with same job-id
      var filteredLetter = letter.filter(function(e) { return (e.id == d.key); })[0];
      // console.log(d, filteredLetter);
      // debugger;
      return filteredLetter.text; // get the related text to add to respective line
    });
    // console.log(texts);
    // console.log(texts.data());
    texts.exit().remove();
    texts
      .enter()
      .append("text")
      .merge(texts)
      // .classed("letter", true)
      .attr("x", function(d,i){ return -10*(i+1); })
      .attr("y", function(_, i) { return calculateYPosition(-i); })
      .attr("text-anchor", "end")
      .style("fill", "#273952")
      .text(function(d) { return d; });
    
    // texts = texts
    //   .attr('transform', function(d, i){
    //     x = i*w/50;
    //     y = (Math.sin(i * frequency + time)) * h/25;
    //     return "translate("+x+","+y+")";
    //   }); 
    
    circles
      .enter()
      .append("circle")
      .on('mouseenter',function(d){
          
          emotionct.innerHTML=emotionkey.find(el=>el.id==d.emotion).emotion;
          emotionct.style.color=emotionkey.find(el=>el.id==d.emotion).color;
          thingct.innerHTML=jobkey.find(el=>el.id==d.job).job;
          whomct.innerHTML=people1key.find(el=>el.id==d.people1).people1;
          whom2ct.innerHTML=people2key.find(el=>el.id==d.people2).people2;
          weatherct.innerHTML=weatherkey.find(el=>el.id==d.weather).weather;
          
          d3.select(this).style("stroke", "black").style('stroke-width', '2px');
      })
      .on('mouseleave', function(d){
          d3.select(this).style("stroke","black").style('stroke-width', '0px');

      })
      .merge(circles)
      .attr("r", 7)
      .attr("fill", function(d){

        if (d.weather == 1) {
          var parentG = d3.select(d3.select(this).node().parentNode)
          var weatherCircle = parentG.select(".weather");
          if (weatherCircle.node()) {
          } else {
            parentG.append("circle")
              .attr("class", "weather")
              .attr("r", 2)
              .attr("cy", -10)
              .attr('fill', 'grey');
            }
        }
      })
      .attr("fill", function(d){
        if (d.people1 == 2) {
          var parentG = d3.select(d3.select(this).node().parentNode)
          var people1Circle = parentG.select('.people1');
          if(people1Circle.node()) {
            people1Circle
              .attr("r",2)
              .attr('cy',10)
              .style('fill','grey');
          } else {
            parentG.append('circle')
              .attr('class', "people1")
              ;
            }
        }
      })
      .attr("fill", function(d){
        if (d.people1 == 3) {
          var parentG = d3.select(d3.select(this).node().parentNode)
          var people2Circle = parentG.select('.people2');
          if(people2Circle.node()) {
            people2Circle
              .attr("width",3)
              .attr('height',3)
              .attr('y',10)
              .style('fill','grey');
          } else {
            parentG.append('rect')
              .attr('class', "people2")
              // .attr('height',4)
              // .attr('width',4)
              // .attr('cx',20)
              ;
            } 
        }
        return scaleColor(d.emotion);
      })
      .attr("fill", function(d){
        if (d.people1 == 4) {
          var parentG = d3.select(d3.select(this).node().parentNode)
          var people3Circle = parentG.select('.people3');
          if(people3Circle.node()) {
            people3Circle
              .attr('width',3)
              .attr('height',3)
              // .attr("rotate",'90')
              .attr('y',10)
              .style('fill','black')
              ;
          } else {
            parentG.append('rect')
              .attr('class', "people3")
              ;
            } 
        }
        // return scaleColor(d.emotion);
      })
      .attr("fill", function(d){
        if (d.people2 == 3) {
          var parentG = d3.select(d3.select(this).node().parentNode);
          var people4Circle = parentG.select('.people4');
          if(people4Circle.node()) {
            people4Circle
              .attr('width',3)
              .attr('height',3)
              .attr('y',14)
              .style('fill','grey')
              ;
          } else {
            parentG.append('rect')
              .attr('class', "people4")
              ;
            } 
        }
      })
      .attr("fill", function(d){
        if (d.people2 == 4) {
          var parentG = d3.select(d3.select(this).node().parentNode);
          var people5Circle = parentG.select('.people5');
          if(people5Circle.node()) {
            people5Circle
              .attr('width',3)
              .attr('height',3)
              .attr('y',14)
              .style('fill','black')
              ;
          } else {
            parentG.append('rect')
              .attr('class', "people5")
              ;
            } 
        }
        return scaleColor(d.emotion);
      });
        time += 0.023;
    });

}


function parse(d){
      return{      
          situation: +d.situation,
          job: d.job,
          order: +d.order,
          emotion: d.emotion,
          weather: +d.weather,
          people1: +d.people1,
          people2: +d.people2,
          people3: +d.people3,
          text: d.text,
        };
}


    const emotionkey=[
        {id:1,emotion:'unproductive',color:'#F6EB9A'},
        {id:2,emotion:'stressed',color:'#fda135'},
        {id:3,emotion:'anxious',color:'#f9201f'},
        {id:4,emotion:'confused',color:'#c51124'},
        {id:5,emotion:'just ok',color:'#fc715d'},
        {id:6,emotion:'relaxed',color:'#9673b9'},
        {id:7,emotion:'happy',color:'#7753d4'},
        {id:8,emotion:'silly',color:'#f769e2'},
        {id:9,emotion:'blurry',color:'#5e7c7f'},
        {id:10,emotion:'productive',color:'#2ebec2'},
        {id:11,emotion:'excited',color:'#1979dc'},
        {id:12,emotion:'nostalgic',color:'#a4e435'},
    ];

    const jobkey=[
        {id:1,job:'writing email',color:'#0c0c04'},
        {id:2,job:'working on projects',color:'#0c0c04'},
        {id:3,job:'talking about work',color:'#0c0c04',},
        {id:4,job:'doing dear data'},
        {id:5,job:'meetings'},
        {id:6,job:'waiting for something'},
        {id:7,job:'walking'},
        {id:8,job:'doing morning preparation'},
        {id:9,job:'having lunch/dinner'},
        {id:10,job:'shopping'},
        {id:11,job:'enjoying spa'},
        {id:12,job:'attending events'},
        {id:13,job:'lying on a couch'},
        {id:14,job:'planning'},
    ];

    const people1key=[
        {id:1,people1:'myself',color:'#0c0c04'},
        {id:2,people1:'my boyfriend',color:'#0c0c04'},
        {id:3,people1:'friend(s)',color:'#0c0c04'},
        {id:4,people1:'coworker/clients',color:'#0c0c04'},
    ];

    const people2key=[
        {id:0,people2:'',color:'#0c0c04'},
        {id:1,people2:'myself',color:'#0c0c04'},
        {id:2,people2:'my boyfriend',color:'#0c0c04'},
        {id:3,people2:'and friend(s)',color:'#0c0c04'},
        {id:4,people2:'and coworker/clients',color:'#0c0c04'},
    ];   

    const people3key=[
        {id:0,people3:'',color:'#0c0c04'},
        {id:1,people3:'myself',color:'#0c0c04'},
        {id:2,people3:'my boyfriend',color:'#0c0c04'},
        {id:3,people3:'and friend(s)',color:'#0c0c04'},
        {id:4,people3:'and coworker/clients',color:'#0c0c04'},
    ];    

    const weatherkey=[
        {id:0,weather:'good'},
        {id:1,weather:'bad'},

    ];

    const letter=[
        {id:1, text:'liam e'},
        {id:2, text:'stcejorp'},
        {id:3, text:'gniklat'},
        {id:4, text:'atad raed'},
        {id:5, text:'sgniteem'},
        {id:6, text:'gnitiaw'},
        {id:7, text:'!gniklaw'},
        {id:8, text:'perp '},
        {id:9, text:'slaem'},
        {id:10, text:'!gnippohs'},
        {id:11, text:'!!aps'},
        {id:12, text:'stneve'},
        {id:13, text:'gniyl'},
        {id:14, text:'gninnalp'},
    ];




