var margin = {t:50,r:50,b:50,l:50};


var w = document.getElementById('canvas').clientWidth - margin.l - margin.r,
    h = document.getElementById('canvas').clientHeight - margin.t - margin.b;


var scaleColor = d3.scaleOrdinal()
      .range(["#fdf63c", "#fda135", "#f9201f", "#c51124", "#fc715d", "#9673b9", "#7753d4", "#f769e2", "#5e7c7f", "#2ebec2", "#1979dc", "#a4e435"])
      .domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);

const emotionct=document.querySelector('#emotion');
const thingct=document.querySelector('#thing');
const whomct=document.querySelector('#whom');
const weatherct=document.querySelector('#weatherDes');

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
               .attr('transform', function(_, i) {
                return 'translate('+(margin.l+i*50)+','+margin.t+')'
              });


  var n = 50,
      frequency = 1/4,
      data = d3.range(n),
      time = 0;


  d3.timer(function (){


//............................................................................................................//

    
   


//............................................................................................................//
   



    var circles = plot.selectAll("g").data(function(d){ return d.values;});
  
    circles = circles
      .enter()
      .append("g")
      .merge(circles)
      .attr('transform', function(d, i){
        var x = (Math.sin(i * frequency + time)) * h/20 /*change this for width of wave*/ + h/30;
        var y = i * w /n;
        return "translate("+x+","+y+")";
      })
      ;

    circles = circles.selectAll("circle").data(function(d){ return [d]; });

    circles
      .enter()
      .append("circle")
      .on('click',function(d){
          
          emotionct.innerHTML=emotionkey.find(el=>el.id==d.emotion).emotion;
          emotionct.style.color=emotionkey.find(el=>el.id==d.emotion).color;
          thingct.innerHTML=jobkey.find(el=>el.id==d.job).job;
          whomct.innerHTML=people1key.find(el=>el.id==d.people1).people1;
          weatherct.innerHTML=weatherkey.find(el=>el.id==d.weather).weather;
          
      })
      .merge(circles)
      .attr("r", 7)
      .attr("fill", function(d){
        if (d.weather == 0) {
          var parentG = d3.select(d3.select(this).node().parentNode)
          var weatherCircle = parentG.select(".weather");
          if (weatherCircle.node()) {
            weatherCircle.attr("r", 2)
              .attr("cx", -10);
          } else {
            parentG.append("circle")
              .attr("class", "weather")
              .attr("r", 2)
              .attr("cx", 10);
          }
        }
        return scaleColor(d.emotion);
      })
      ;

        time += 0.005;
    });

console.log([weather]);

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
        }
};


    const emotionkey=[
        {id:1,emotion:'unproductive',color:'#fdf63c'},
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
    ]

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
    ]

    const people1key=[
        {id:1,people1:'myself',color:'#0c0c04'},
        {id:2,people1:'my boyfriend',color:'#0c0c04'},
        {id:3,people1:'friend(s)',color:'#0c0c04'},
        {id:4,people1:'coworker/clients',color:'#0c0c04'},
    ]

    const weatherkey=[
        {id:0,weather:'good'},
        {id:1,weather:'bad'},

    ]