if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer , tick = 0;
var h = $('#handle'),
    l = $('#container'),
    r = $('#controller'),
    w = $('body').width() - 18;

var gui = new dat.GUI( { width: 350, autoPlace: false } );
var W = l.width(), H = window.innerHeight;
var title;

function init() {

    var container = document.getElementById( 'container' );
    var controller = document.getElementById('controller');

    camera = new THREE.PerspectiveCamera( 60, W/H, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0xffffff ) );
    scene.fog = new THREE.FogExp2( 0x00000, 0.02 );

    var geometry = new THREE.PlaneGeometry(1000,1000);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('/static/textures/air.jpg',THREE.SphericalRefractionMapping) } );
    var title = new THREE.Mesh( geometry, material );
    title.overdraw = true;
    title.castShadow = true;
    scene.add( title );
    
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

    scene.fog.density = .05;
    gui.add( scene.fog, "density", .0002, .03 ).listen();
    gui.domElement.id = 'gui';
    controller.appendChild(gui.domElement);
    /* END CONTROLS
    */

    // RESIZE PANES 
    // uses jquery
    var isDragging = false;

    h.mousedown(function(e){
        isDragging = true;
        e.preventDefault();
    });
    $(document).mouseup(function(){
        isDragging = false;
    }).mousemove(function(e){
        if(isDragging){
            l.css('width', e.pageX);
            r.css('width', w - e.pageX);
            camera.aspect = l.width() / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( l.width(), window.innerHeight );
        }
    });
}

function animate() {

    requestAnimationFrame( animate );
    time = Date.now();
    render( time );

}
    
knob.eht.value = .03;
function render( time ){

    scene.fog.density = ease(.0002, .03, knob.eht.value, scene.fog.density, .1)

    renderer.render( scene, camera );

}

init();
animate();
