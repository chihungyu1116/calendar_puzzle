var facebook = (function(){

    // Used to store configurations
    var Config = {
        container : {
            timeline : null,
            events : null,
            events_content : null
        },

        start : 0,
        end : 0,
        width : 0,
        widthOffset : 0,

        // for testing purpose
        events : [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}
        , {start: 310, end: 470}, {start: 510, end: 600}, {start: 210, end: 250}, {start: 510, end: 550}, {start: 300, end: 390}
        , {start: 635, end: 650}, {start: 660, end: 670} ],

        init : function(spec){
            this.start = spec.start;
            this.end = spec.end;
            this.width = spec.width;
            this.widthOffset = spec.widthOffset;
            this.container.timeline = document.getElementById("Timeline");
            this.container.events = document.getElementById("Events");
            this.container.events_content = document.getElementById("Events_content");
        }
    },

    // Create timeline dynamically rather than statistically in the markup for flexibility of start time and end time.
    // For simplicity not using templating system.
    Timeline = {
        create : function(spec){
            var elem;
            elem = document.createElement("li");
            elem.className = "time";                      
            if(spec.type === "hour"){
                elem.innerHTML = ["<span class='f_heavy'>",spec.time,":00</span>","<span class='f_light'>AM</span>"].join("");
            } else {
                elem.innerHTML = ["<span class='f_light'>",spec.time,":30</span>"].join("");
            }

            this.add(elem);
        },
        add : function(elem){           
            Config.container.timeline.appendChild(elem);
        },
        finish : function(time){
            this.create({
                type:"hour",
                time:time
            });
        },
        init : function(){
            var that = this;
            (function loadAsync(time){
                if(time >= Config.end) return that.finish(time);
                
                that.create({
                    type : "hour",
                    time : time
                });
                that.create({
                    type : "half",
                    time : time
                });

                return loadAsync(++time);
            }(Config.start));        
        }
    },

    // Set width the height for the containers
    Calendar = {
        init : function(){
            var minsPerHour = 60,
                offset = 30, // Timeline has 25 labels and each has height 30 pixels (25 x 30 = 750, 750 - 720 = 30)
                timeFrame = (Config.end - Config.start) * minsPerHour;
            Config.container.timeline.style.height = (timeFrame + offset) + "px";
            Config.container.events.style.height = timeFrame + "px";
            Config.container.events.style.width = Config.width + "px";
        }
    },
    Fb = {             
        init : function(spec){
            Config.init(spec);
            Timeline.init();
            Calendar.init();


            // For testing
            // layOutDay(Config.events);
        }
    };
    return {
        init : function(spec){            
            Fb.init(spec);
        },
        config : Config
    };
}());