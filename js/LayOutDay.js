var layOutDay = (function(){
    var Event = {       
        width : 0,
        
        // Event constructor
        create : function(spec){            
            this.id = spec.id;
           
            this.start = spec.start || 0;
            this.end = spec.end || 0;

            this.left = -1;

            this.height = spec.end - spec.start || 0;
            this.width = 0;
            this.depth = 1;

            this.siblings = [];
            
            this.name = spec.name || "Sample Name";
            this.location = spec.location || "Sample Location";       
        },

        findOverlaps : function(event1,eventsArr){
            var that = this;
            eventsArr.forEach(function(event2){
                if(event1.id !== event2.id){
                    if( (event1.start <= event2.start && event1.end >= event2.start) ||
                        (event2.start <= event1.start && event2.end >= event1.start) ){
                        event1.siblings.push(event2);
                    }
                }
            });
        },
        traverseAndFindOverlaps : function(eventsArr){
            var that = this;           
            eventsArr.forEach(function(event){
                that.findOverlaps(event,eventsArr);
            });            
        },

        // Find number of overlaps of [{start:300,end:600},{start:310,end:550},{start:100,end:200}] by
        // converting it to [ 100S, 200E, 300S, 310S, 550E, 600E ].
        // Each S must have an E --> use stack to achieve that
        findDepth : function(eventsArr){
            var tmp = [], 
                overlaps = 0,
                stack = ['GO'];
        
            eventsArr.forEach(function(event){
                tmp.push(event.start + "S");
                tmp.push(event.end + "E");
            });

            tmp = tmp.sort(function(a,b){
                return a > b ? 1 : -1;
            });

            tmp.forEach(function(item){
                if(item.match("S")){
                    if(!stack.pop()){
                        overlaps++;
                    }
                } else if(item.match("E")) {
                    stack.push(item);
                }
            });
            return overlaps + 1;
        },
        setDepth : function(event){
            var siblings = event.siblings;

            if(siblings.length > 0){
                event.depth += this.findDepth(siblings) ;
            }
        },
        // Update depth to direct and indirect siblings as they should share the same width
        updateDepth : function(event){
            var siblings = event.siblings,
                maxDepth = event.depth,
                tmpArr = [event];

            siblings.forEach(function(sibling){
                if(sibling.depth > maxDepth){
                    tmpArr.forEach(function(tmp){
                        tmp.depth = sibling.depth;
                    });
                } else {
                    sibling.depth = maxDepth;
                    tmpArr.push(sibling);
                }
            });           
        },

        // depth = overlaps + 1 (itself)
        // for example:
        // In order to find the depth of A,
        // we need to check find the depth of B.
        // 
        // But to determine B, we need to determine both A and C.
        // 
        // B has overlaps with A and C,
        // but A and C don't overlaps with the other
        //  _
        // |A| _ 
        // |_||B| 
        //    | | _
        //    |_||C|
        //       |_| 
        // 
        // A overlaps with B --> 1 overlaps
        // B overlaps with A C --> 2 overlaps
        // C overlaps with B --> 1 overlaps
        //
        // the overlaps for B is 1 rather than 2
        //  _
        // |A| _ 
        // |_||B| 
        //  _ | | 
        // |C||_|
        // |_|        
        // 
        // depth = overlaps + 1. Thus, its 2 in this case.
        // Update A B C's depth to 2
        //
        traverseAndSetDepth : function(eventsArr){
            var that=this;
            eventsArr.forEach(function(event){
                that.setDepth(event);
            });

            eventsArr.forEach(function(event){
                that.updateDepth(event);
            });
        },
        draw : function(event,container){
            var event_elem,
                width=this.width;

            event_elem = document.createElement("div");
            event_elem.className = "event";
            event_elem.style.left = event.left + "px";
            event_elem.style.top = event.start + "px";
            event_elem.style.height = event.height + "px";   
            event_elem.style.width = event.width + "px";
       
            event_elem.innerHTML = [
                "<div class='event__frame'>",
                "<div class='event__name'>",event.name,"</div>",
                "<div class='event__location'>",event.location,"</div>",
                "</div>"
            ].join("");
            
            container.appendChild(event_elem);
        },
        traverseAndDraw : function(eventsArr){
            var that = this,
                container = facebook.config.container.events_content;
            eventsArr.forEach(function(event){
                that.draw(event,container);
            });   
        },

        // Set position of event using hashtable that hash event's siblings' left positons.
        // Event will try to find the left most available spot starting at 0
        // Since siblings share the same width.
        // For width == 150, and a hashtable like this.
        // Event will pick position 150
        // {
        //   0 : true,
        //   300 : true, 
        //   600 : true
        // }
        setWidthAndPosition : function(event){
            var hashmap = {},
                siblings = event.siblings,
                width = this.width/event.depth,
                leftPosition = 0;

            siblings.forEach(function(sibling){
                hashmap[sibling.left] = true;
            });

            while(hashmap[leftPosition]){
                leftPosition+=width;
            }
            
            event.width = width;
            event.left = leftPosition;
        },
        traverseAndSetWidthAndPosition : function(eventsArr){
            var that = this;

            eventsArr.forEach(function(event){
                that.setWidthAndPosition(event);
            });
        },


        init : function(eventsArr){        
            this.width = facebook.config.width - facebook.config.widthOffset; // Event container width, 600 in this case
            this.traverseAndFindOverlaps(eventsArr); // For each event, find its corresponding overlaps
            this.traverseAndSetDepth(eventsArr); // Check if overlaps overlap the others or not
            this.traverseAndSetWidthAndPosition(eventsArr); // Set width and left position
            this.traverseAndDraw(eventsArr); // Draw and done
        }            
    },

    clear = function(){
        // Remove markup
        facebook.config.container.events_content.innerHTML="";
    },

    // Remove invalid events
    filter = function(eventsArr){
        return eventsArr.filter(function(event){
            if(event.start === undefined || event.end === undefined){
                return false;
            }
            if(event.start >= event.end){
                return false;
            }
            if(event.start < 0){
                return false;
            }
            return true;
        });
    },
    // Sort based on start time if same then length
    sort = function(eventsArr){
        return eventsArr.sort(function(a,b){
            return a.start === b.start ? b.end - a.end : a.start - b.start;
        });
    },
    // Construct events
    prepare = function(eventsArr){
        return eventsArr.map(function(spec,id){
            spec.id = id;
            return new Event.create(spec);
        });
    },
    init = function(eventsArr){
        if(eventsArr instanceof Array){
            clear();
            eventsArr = prepare(sort(filter(eventsArr)));
            Event.init(eventsArr);
        }
    };
    return function(eventsArr){
        init(eventsArr);
    };
}());