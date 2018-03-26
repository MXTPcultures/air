if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;

var olivia = {
        shape: new THREE.SphereGeometry( 1, 64, 16 ),
        light: new THREE.PointLight( 0x99ceff, 10, 50 ),
        pulse: undefined, 
        pulse_inc: 0,
        level: 0,
        color: 0x99ceff,
        size: 1,
        height: 1
}

var adeymo = {
        shape: new THREE.SphereGeometry( 1, 64, 16 ),
        light: new THREE.PointLight( 0xff0f00, 10, 50 ),
        pulse: undefined,
        pulse_inc: 0,
        angle: Math.PI/6,
        color: 0xff0f00,
        size: 1,
        height: 1
}

var eyes = [];
for(var i = 0; i < 12; i++){
    eyes[i] = {
            shape: undefined,
            light: undefined,
            pulse: undefined,
            pulse_inc: 0,
            level: 0,
            color: randomColor({ luminosity: 'bright', hue: 'blue' }),
            size: 1,
            height: 1
    };
}

var ground;

var starCount = 1200;
var star = [];
var pulse=0;
var clock = new THREE.Clock(); //use Date.now() instead?
var gui = new dat.GUI();

var pulse_options; 

var PI = Math.PI;
var W = window.innerWidth, H = window.innerHeight;

var mixer, loader;

var object;

function init() {

    var container = document.getElementById( 'container' );
    //var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x00020 ) );
    scene.fog = new THREE.FogExp2( 0x00000, 0.02 );

    /* IMPORT VIDEOS HERE
    */ 
    // this could be better, return scene add, xyz positioning
    streets1 = loadVideo("/media/streets.m4v");
    streets1.screen.position.y = -50;
    streets1.screen.opacity = 1;
    scene.add(streets1.screen);

    streets2 = loadVideo("/media/streets2.mp4");
    streets2.screen.position.y = -50;
    streets2.screen.opacity = 1;
    scene.add(streets2.screen);

    bookstore1 = loadVideo("/media/bookstore1s.mp4");
    bookstore1.screen.position.y = -50;
    bookstore1.screen.opacity = 1;
    scene.add(bookstore1.screen);

    bookstore2 = loadVideo("/media/bookstore2s.mp4");
    bookstore2.screen.position.y = -50;
    bookstore2.screen.opacity = 1;
    scene.add(bookstore2.screen);

    /* END IMPORT
    */

    /* CREATE MAIN POINT LIGHT
    */
    pulse_options = {
        pace: .01, 
        min: .0005,
        max: .01,
    };

    olivia.light.add( new THREE.Mesh( olivia.shape, new THREE.MeshBasicMaterial( { color: olivia.color } ) ) );
    olivia.light.position.x = 90;
    olivia.light.position.y = 0;
    olivia.light.position.z = 0;
    olivia.light.visible = true;
    scene.add( olivia.light );

    olivia.pulse = new THREE.Mesh( olivia.shape.clone(), pulseMaterial(olivia.color) ),
    olivia.pulse.position.x = 90;
    olivia.pulse.position.y = 0;
    olivia.pulse.position.z = 0;
    scene.add( olivia.pulse );

    adeymo.light.add( new THREE.Mesh( adeymo.shape, new THREE.MeshBasicMaterial( { color: adeymo.color } ) ) );
    adeymo.light.position.x = -90;
    adeymo.light.position.y = 0;
    adeymo.light.position.z = 0;
    scene.add( adeymo.light );

    adeymo.pulse = new THREE.Mesh( adeymo.shape.clone(), pulseMaterial(adeymo.color) ),
    adeymo.pulse.position.x = -90;
    adeymo.pulse.position.y = 0;
    adeymo.pulse.position.z = 0;
    scene.add( adeymo.pulse );

    //add ground plane
    var plane = new THREE.PlaneGeometry(1000, 1000);
    ground = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x824242 , side: THREE.DoubleSide }));
    ground.position. y = -50;
    ground.rotation.x = Math.PI/2; 
    scene.add(ground);

    for(var i = 0 ; i < 12 ; i++){
        eyes[i].shape = new THREE.SphereGeometry( 1, 64, 16 );
        eyes[i].light = new THREE.PointLight( eyes[i].color, 10, 50 );
        eyes[i].light.add( new THREE.Mesh( olivia.shape, new THREE.MeshBasicMaterial( { color: eyes[i].color } ) ) );
        
        eyes[i].light.position.z = -100;

        eyes[i].light.visible = false;
        scene.add( eyes[i].light );

        eyes[i].pulse = new THREE.Mesh( olivia.shape.clone(), pulseMaterial(eyes[i].color) );
        
        eyes[i].pulse.scale.multiplyScalar(8);
        eyes[i].pulse.visible = false;
        scene.add( eyes[i].pulse );
    }

    //super lazy
    /*for(i = 0 ; i <= 12 ; i++){
        eyes[i].light.position.x = 120 - 20*i ;
        eyes[i].light.position.y = 15 + 5*i;
    }*/

    eyes[0].light.position.x = -120;
    eyes[0].light.position.y = 15;

    eyes[1].light.position.x = -100;
    eyes[1].light.position.y = 30;

    eyes[2].light.position.x = -80;
    eyes[2].light.position.y = 40;

    eyes[3].light.position.x = -60;
    eyes[3].light.position.y = 45;

    eyes[4].light.position.x = -40;
    eyes[4].light.position.y = 48;

    eyes[5].light.position.x = -20;
    eyes[5].light.position.y = 50;

    eyes[6].light.position.x = 20;
    eyes[6].light.position.y = 50;

    eyes[7].light.position.x = 40;
    eyes[7].light.position.y = 48;

    eyes[8].light.position.x = 60;
    eyes[8].light.position.y = 45;

    eyes[9].light.position.x = 80;
    eyes[9].light.position.y = 40;

    eyes[10].light.position.x = 100;
    eyes[10].light.position.y = 30;    

    eyes[11].light.position.x = 120;
    eyes[11].light.position.y = 15; 

    for(var i = 0 ; i < 12 ; i++){
        eyes[i].pulse.position.x = eyes[i].light.position.x;
        eyes[i].pulse.position.y = eyes[i].light.position.y;
        eyes[i].pulse.position.z = eyes[i].light.position.z;
    }

    /* END MAIN POINT LIGHT
    */ 

    /* CREATE STAR SYSTEM
    */
    THREE.TextureLoader.crossOrigin = '';

    // make smaller and only in sky

    var starShape = new THREE.SphereGeometry( 1, 64, 16 );

    for (var p = 0; p < starCount; p++){ 
        // create a star of random color
        var colors = randomColor({
           luminosity: 'light',
           hue: 'blue'
        });
        
        star[p] = new THREE.PointLight( colors, 10, 50 );
        star[p].add( new THREE.Mesh( starShape, new THREE.MeshBasicMaterial( { color: colors } ) ) );
        //star[p] = new THREE.Mesh( starShape, new THREE.MeshBasicMaterial( { color: colors, transparent: true, opacity: 0} ) );
        star[p].visible = false;

        var pX = Math.random() * 800 - 400; // pre-load random numbers
        var pY = Math.random() * 800 - 400; // see example in GPU particle system
        var pZ = Math.random() * 800 - 400;

        star[p].position.x = pX;
        star[p].position.y = pY;
        star[p].position.z = pZ;

        var radius = Math.sqrt(pX*pX + pY*pY + pZ*pZ)
        if(radius > 150 && radius < 400 && pY > 10) 
            scene.add( star[p] );
    }
    /* END STAR SYSTEM
    */


    gui.add( scene.fog, "density", .0002, .02 ).listen();
    var f0 = gui.addFolder('pulsing')    
    gui.add( pulse_options, "pace", pulse_options.min, pulse_options.max ).listen();
    gui.add( olivia, "size", 0, 50 ).listen();
    gui.add( adeymo, "size", 0, 3 ).listen();

    olivia.light.visible = true;
    olivia.pulse.visible = true;
    adeymo.light.visible = true;
    adeymo.pulse.visible = true;
    console.log(olivia);
    console.log(adeymo);

    videoControls(streets1);
    videoControls(streets2);
    videoControls(bookstore1);
    videoControls(bookstore2);


    /* CONFIG RENDERER
    */
    renderer = new THREE.WebGLRenderer( { antialias: false , preserveDrawingBuffer: true, alpha: true} );
    renderer.setSize( W, H );
    //renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    /* END RENDERER
    */

    /* INTERACTIVE CONTROLS
    */ 
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //console.log(controls);
    //gui.domElement.id = 'gui';

    //container.appendChild(gui.domElement);

    /* END CONTROLS
    */

    /* ADD LISTENERS
    */ 
    // create fallbacks if no midi
    window.addEventListener('keydown', handleKeyDown, false);
    //window.addEventListener('keyup', handleKeyUp, false);
    window.addEventListener( 'resize', onWindowResize, false );


}

/*UTILTY FUNCTIONS
*/

function lightAppear(object, object2, control){
    if(control.pressed){
        object.light.visible = !object.light.visible; 
        object.pulse.visible = !object.pulse.visible;
        object2.light.visible = !object2.light.visible; 
        object2.pulse.visible = !object2.pulse.visible;
        control.pressed = false;     
    }
}    

/* END UTILTIES
*/

function animate() {

    requestAnimationFrame( animate );

    time = Date.now();

    render( time );

}
    
var supermoon = true;
var therapy = false;
var bookstore = false;
var bookstore2 = false; 
var bookstore3 = false; 

midiController("akai");
knob.eht.value = 1;

function render( time ){

    var p = Math.floor(Math.random() * starCount);
    star[p].visible = true;

    scene.fog.density = ease(.0002, .02, knob.eht.value, scene.fog.density, .1);

    screenSwitch(pad.one, streets1);
    screenSwitch(pad.two, streets2);
    screenSwitch(pad.thr, bookstore1);
    screenSwitch(pad.fur, bookstore2);

    screenOpacity(knob.one, streets1);
    screenOpacity(knob.two, streets2);
    screenOpacity(knob.thr, bookstore1);
    screenOpacity(knob.fur, bookstore2);

    // fix: need ifs to allow dat gui fall back...

    pulse_options.pace = ease(.0005, .01, knob.fve.value, pulse_options.pace, .05);

    olivia.size = knob.six.value*50;//ease(0, 50, knob.six.value, olivia.size, .001)
    olivia.pulse.scale.x = olivia.size;
    olivia.pulse.scale.y = olivia.size;
    olivia.pulse.scale.z = olivia.size;

    adeymo.size = knob.svn.value*50; //ease(0, 3, knob.svn.value, adeymo.size, .001)
    adeymo.pulse.scale.x = adeymo.size;
    adeymo.pulse.scale.y = adeymo.size;
    adeymo.pulse.scale.z = adeymo.size;

    //console.log(pulse_options.pace);

    // slow/stop pulse
    pulseAnimation(olivia);
    pulseAnimation(adeymo);
    
    olivia.pulse.lookAt(camera.position);
    adeymo.pulse.lookAt(camera.position);

    if(supermoon){
        /*if(octave2.C.pressed){
            adeymo.angle += pressLength(octave2.C)*.00001; 
        }
        if(octave2.Csh.pressed){
            adeymo.angle -= pressLength(octave2.Csh)*.00001; 
        }
        adeymo.pulse.material.uniforms[ "c" ].value = -.2;
        radius = Math.sqrt(150*150 + 70*70);
        var pX = radius*Math.cos(adeymo.angle);
        var pY = radius*Math.sin(adeymo.angle);
        adeymo.light.position.x = ease(pX, adeymo.light.position.x, .005 );
        adeymo.light.position.y = ease(pY, adeymo.light.position.y, .005 );
        adeymo.pulse.position.x = adeymo.light.position.x;
        adeymo.pulse.position.y = adeymo.light.position.y;
        */
        if(pad.fve.pressed){ 
            supermoon = false;
            therapy = true;
            pad.fve.pressed = false;
        }
    }
    if(therapy){
        /*pulseAnimation(adeymo);
        adeymo.light.position.x = ease(0, adeymo.light.position.x, .001 );
        adeymo.light.position.y = ease(-40, adeymo.light.position.y, .001 );
        adeymo.light.position.z = ease(0, adeymo.light.position.z, .001 );
        adeymo.pulse.position.x = adeymo.light.position.x;
        adeymo.pulse.position.y = adeymo.light.position.y;
        adeymo.pulse.position.z = adeymo.light.position.z;

        adeymo.light.scale.x = ease(.1, adeymo.light.scale.x, .001 );
        adeymo.light.scale.y = ease(.1, adeymo.light.scale.y, .001 );
        adeymo.light.scale.z = ease(.1, adeymo.light.scale.z, .001 );

        //adeymo.color = 0xffff4d;
        adeymo.light.children[0].material.color[0] = ease(1, adeymo.light.children[0].material.color[0], .001);
        adeymo.light.children[0].material.color[1] = ease(1, adeymo.light.children[0].material.color[1], .001);
        adeymo.light.children[0].material.color[2] = ease(.3, adeymo.light.children[0].material.color[2], .001);
        adeymo.color = ease(0xffff4d, adeymo.color, .1);
        adeymo.pulse.material = pulseMaterial(adeymo.color);
        //adeymo.light.children[0].material.color = adeymo.color;

        olivia.light.position.x = ease(0, olivia.light.position.x, .001 );
        olivia.light.position.y = ease(55, olivia.light.position.y, .001 );
        olivia.light.position.z = ease(-100, olivia.light.position.z, .001 );
        olivia.pulse.position.x = olivia.light.position.x;
        olivia.pulse.position.y = olivia.light.position.y;
        olivia.pulse.position.z = olivia.light.position.z;
        olivia.light.visible = true;

        lightAppear(eyes[0], eyes[11], octave2.C);        
        lightAppear(eyes[1], eyes[10], octave2.Csh);
        lightAppear(eyes[2], eyes[9], octave2.D);
        lightAppear(eyes[3], eyes[8], octave2.Dsh);
        lightAppear(eyes[4], eyes[7], octave2.E);
        lightAppear(eyes[5], eyes[6], octave2.F);
        */

        ground.position.y -= .1;

        if(pad.six.pressed){ 
            therapy = false;
            bookstore = true;
            pad.six.pressed = false ;
        }
    }   
    if(bookstore){
        /*
        pulseAnimation(adeymo);
        adeymo.light.position.x = ease(-90, adeymo.light.position.x, .001 );
        adeymo.light.position.y = ease(0, adeymo.light.position.y, .001 );
        adeymo.light.position.z = ease(0, adeymo.light.position.z, .001 );
        adeymo.pulse.position.x = adeymo.light.position.x;
        adeymo.pulse.position.y = adeymo.light.position.y;
        adeymo.pulse.position.z = adeymo.light.position.z;

        adeymo.light.scale.x = ease(.01, adeymo.light.scale.x, .001 );
        adeymo.light.scale.y = ease(.01, adeymo.light.scale.y, .001 );
        adeymo.light.scale.z = ease(.01, adeymo.light.scale.z, .001 );

        olivia.light.position.x = ease(90, olivia.light.position.x, .001 );
        olivia.light.position.y = ease(0, olivia.light.position.y, .001 );
        olivia.light.position.z = ease(0, olivia.light.position.z, .001 );
        olivia.pulse.position.x = olivia.light.position.x;
        olivia.pulse.position.y = olivia.light.position.y;
        olivia.pulse.position.z = olivia.light.position.z;
        */
        if(pad.svn.pressed){ 
            bookstore = false;
            bookstore2 = true;
            pad.svn.pressed = false ;
            //olivia.level = olivia.light.position.x;
            //adeymo.level = adeymo.light.position.x;
        }

    }

    if(bookstore2){    
        /*
        if(octave2.C.pressed){

            olivia.level -= pressLength(octave2.C)*.001; 
        }
        olivia.light.position.x = ease(olivia.level, olivia.light.position.x, .01 );
        olivia.pulse.position.x = olivia.light.position.x;

        if(octave1.B.pressed){

            adeymo.level += pressLength(octave1.B)*.001; 
        }
        adeymo.light.position.x = ease(adeymo.level, adeymo.light.position.x, .01 );
        adeymo.pulse.position.x = adeymo.light.position.x;

        if(octave2.Csh.pressed){

            olivia.level += pressLength(octave2.Csh)*.001; 
        }
        olivia.light.position.x = ease(olivia.level, olivia.light.position.x, .01 );
        olivia.pulse.position.x = olivia.light.position.x;

        if(octave1.Ash.pressed){

            adeymo.level -= pressLength(octave1.Ash)*.001; 
        }
        adeymo.light.position.x = ease(adeymo.level, adeymo.light.position.x, .01 );
        adeymo.pulse.position.x = adeymo.light.position.x;
        */
        olivia.light.position.x -= .01;
        olivia.pulse.position.x = olivia.light.position.x;

        adeymo.light.position.x += .01;
        adeymo.pulse.position.x = adeymo.light.position.x;

        if(pad.eht.pressed){
            bookstore3 = true;
            pad.eht.pressed = false;
        }


    }

    if(bookstore3){
        //adeymo.color = 0xffffff;
        /*
        adeymo.light.children[0].material.color[0] = ease(1, adeymo.light.children[0].material.color[0], .001);
        adeymo.light.children[0].material.color[1] = ease(1, adeymo.light.children[0].material.color[1], .001);
        adeymo.light.children[0].material.color[2] = ease(1, adeymo.light.children[0].material.color[2], .001);
        adeymo.color = ease(0xffffff, adeymo.color, .1);
        adeymo.pulse.material = pulseMaterial(adeymo.color);
        adeymo.light.children[0].material.color = adeymo.color;

        //olivia.color = 0xffffff;
        olivia.light.children[0].material.color[0] = ease(1, olivia.light.children[0].material.color[0], .001);
        olivia.light.children[0].material.color[1] = ease(1, olivia.light.children[0].material.color[1], .001);
        olivia.light.children[0].material.color[2] = ease(1, olivia.light.children[0].material.color[2], .001);
        olivia.color = ease(0xffffff, olivia.color, .1);
        olivia.pulse.material = pulseMaterial(olivia.color);
        olivia.light.children[0].material.color = olivia.color;
        */

    }

    updateAllVideos();

    renderer.render( scene, camera );

}

init();
animate();
