gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);

function clampBuilder( minWidthPx, maxWidthPx, minFontSize, maxFontSize ) {
    const root = document.querySelector( "html" );
    const pixelsPerRem = Number( getComputedStyle( root ).fontSize.slice( 0,-2 ) );
    const minWidth = minWidthPx / pixelsPerRem;
    const maxWidth = maxWidthPx / pixelsPerRem;
    const slope = ( maxFontSize - minFontSize ) / ( maxWidth - minWidth );
    const yAxisIntersection = -minWidth * slope + minFontSize
    return `clamp( ${ minFontSize }rem, ${ yAxisIntersection }rem + ${ slope * 100 }vw, ${ maxFontSize }rem )`;
}


window.addEventListener("load", () => {
  const heroH1 = document.querySelectorAll(".section.hero div *");

  heroH1.forEach((h1) => {
  const text = h1.textContent;
  
  // Clear original content of h1
  h1.textContent = '';
  
  // Wrap each letter in a span and append to the h1
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    h1.appendChild(span);
  });
});

  // GSAP timeline for scroll-triggered animation
gsap.timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
        once: true
      }
    })
    .to("img", {
      scale: 2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut"
    })
    .to(
      ".section.hero",
      {
        scale: 1.1,
        transformOrigin: "center center",
        ease: "power1.inOut"
      },
      "<"
    )
    .from(
        heroH1, // Targeting each span wrapping a letter
      {
        y: 500,
        opacity: 0,
        ease: "power1.out",
        stagger: 0.05, // Stagger animation for each letter
      },
      "<"
    ).to(
        ".section.hero",
        {
          scale: 1,
          transformOrigin: "center center",
          ease: "power1.inOut"
        },
        ">"
      )
      .to(
        heroH1, // Targeting each span wrapping a letter
        {
          y: 500,
          opacity: 0,
          ease: "power1.out",
          stagger: 0.05, // Stagger animation for each letter
        },'>')
      .to(
        ".wrapper",
        {
          opacity: 0,

          transformOrigin: "center center",
          ease: "power1.inOut",
          duration: 0.5
        },
        ">" // Ensures it happens at the end of the previous animation
      )
      .set(
        ".wrapper", 
        { 
          display: 'none' 
        }, 
        ">" // Ensures the set happens right after the opacity animation
      )
      .set(
        '.pin-spacer',
        {display:'none'},
        '<'
      )
});

// Create a simple timeline without scrolltrigger

const tl = gsap.timeline();

tl.set(
    '.cover',
    {display: 'block'}
)
.fromTo
('.cover',
{
    opacity: 0,
    duration: 1
},
{
    opacity: 1,
    duration: 1
}
);

let layers = document.querySelectorAll("div[class *= 'layer']");
layers = Array.from(layers);

layers.forEach(layer => {
    // Get all child elements of the layer that you want to animate
    const elements = layer.querySelectorAll('*');
  
    elements.forEach(element => {
      // Randomly decide whether to animate from the left (-100%) or right (100%)
      const randomDirection = Math.random() > 0.5 ? 100 : -100;
  
      gsap.from(element, {
        scrollTrigger: {
          scroller: ".cover", // Your custom scroller
          trigger: layer,
          start: "top 75%", // Animation starts when the element is at the center of the viewport       
          // Optional: You can add scrub if you want the animation tied to the scroll progress
          // scrub: true
        },
        opacity: 0,
        x: `${randomDirection}%`,
        y: `${randomDirection}%`,
        ease: "power2.out",
        duration: 3, // Animation duration
        stagger:1
      });
    });
  });
  
let sectionHeader = document.querySelectorAll( "div[class *= layer] > h2" );
let sectionPara = document.querySelectorAll( "div[class *= layer] > p" );
let codes = document.querySelectorAll( "pre" );
let subHeadings = document.querySelectorAll( "div[class *= layer] > h3" );

sectionHeader.forEach((header) => {
    header.style.fontSize = clampBuilder(300, 2000, 1.5, 2.5);
});
sectionPara.forEach((para) => {
    para.style.fontSize = clampBuilder(300, 2000, 1, 1.55);
});
subHeadings.forEach((sub) => {
    sub.style.fontSize = clampBuilder(300, 2000, 1.25, 2);
});
codes.forEach((block) => {
    // Remove extra spaces after newline characters
    block.textContent = block.textContent.replace(/(?<=\n)\s+/g, '');

    // Replace explicit "\br" with actual newline characters
    block.textContent = block.textContent.replace(/\\br/g, '\n');

    // Add indentation after "%>%" and "+"
    block.textContent = block.textContent.replace(/(%>%|\+)\s*\n/g, (match) => `${match.trim()}\n\t`);

    // Remove leading spaces at the beginning of the block
    block.textContent = block.textContent.replace(/^\s+/, '');

    // Replace "\t" with actual tab characters
    block.textContent = block.textContent.replace(/\\t/g, '\t');
});

let listContainers = document.querySelectorAll('#list-container > div');
let buttons = document.querySelectorAll('.toggle-section button');
listContainers = Array.from(listContainers);
buttons = Array.from(buttons);

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        button.classList.add('active');
        listContainers[index].classList.remove('hidden');
        buttons.forEach((otherButton, otherIndex) => {
            if (otherIndex !== index) {
                otherButton.classList.remove('active');
                listContainers[otherIndex].classList.add('hidden');
            }
        });
    })
    // Turn off all other buttons

});

function init() {
    const $ = go.GraphObject.make;  // shorthand for GoJS function
  
    const myDiagram = $(go.Diagram, "myDiagramDiv", {
      initialContentAlignment: go.Spot.Center,  // center diagram contents
      layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 }),  // tree layout
      "undoManager.isEnabled": true  // enable undo & redo
    });
  
    // Define node template with collapsibility and animations
    myDiagram.nodeTemplate =
      $(go.Node, "Horizontal",  // Tree node in a horizontal layout
        {
          isTreeExpanded: false,  // Initially collapsed
          selectionChanged: node => node.findTreeChildrenNodes().each(child => {
            // Basic animation when expanding/collapsing
            const animation = new go.Animation();
            animation.add(child, "visible", !child.visible);  // toggle visibility of child nodes
            animation.start();
          })
        },
        // Panel for the node content
        $(go.Panel, "Auto",
          // Condition for square nodes (except root)
          new go.Binding("figure", "key", function(key) {
            return key === "Start" ? "Ellipse" : "Rectangle";  // Ellipse for root, Rectangle for others
          }),
          $(go.Shape, "Rectangle", { fill: "lightblue", stroke: "gray" },
            new go.Binding("figure", "key", function(key) {
              return key === "Start" ? "Ellipse" : "Rectangle";  // Shape based on node type
            })
          ),
          $(go.TextBlock, { margin: 8, font: "bold 12px sans-serif", stroke: "black" },
            new go.Binding("text", "key"))  // Node key as text
        ),
        $("TreeExpanderButton", {
          width: 14,
          height: 14,
          margin: 5,
          click: (e, obj) => {
            const node = obj.part;
            if (node) {
              const diagram = node.diagram;
              diagram.startTransaction("collapse/expand");
              const expand = !node.isTreeExpanded;
              node.findTreeChildrenNodes().each(child => child.visible = expand);
              node.isTreeExpanded = expand;  // expand or collapse the node
              diagram.commitTransaction("collapse/expand");
            }
          }
        })
      );
  
    // Define link template
    myDiagram.linkTemplate =
      $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape, { strokeWidth: 2, stroke: "#555" })  // link shape
      );
  
    // Define the model with nodes and links
    myDiagram.model = new go.GraphLinksModel(
        [
          { key: 'Start' },
          { key: 'Black Box Models', parent: 'Start' },
          { key: 'Interpretable Models', parent: 'Start' },
          { key: 'Statistical Learning', parents: ['Black Box Models', 'Interpretable Models'] },
          { key: 'Supervised Learning', parent: 'Statistical Learning' },
          { key: 'Un-supervised Learning', parent: 'Statistical Learning' },
          { key: 'Model Agnostic Methods (Sup)', parent: 'Supervised Learning' },
          { key: 'Model-Specific Methods (Sup)', parent: 'Supervised Learning' },
          { key: 'Model Agnostic Methods (Un-Sup)', parent: 'Un-supervised Learning' },
          { key: 'Model-Specific Methods (Un-Sup)', parent: 'Un-supervised Learning' },
          { key: 'Global Methods', parent: 'Model Agnostic Methods (Sup)' },
          { key: 'Local Methods', parent: 'Model Agnostic Methods (Sup)' },
          { key: 'Global Methods (Un-Sup)', parent: 'Model Agnostic Methods (Un-Sup)' },
          { key: 'Local Methods (Un-Sup)', parent: 'Model-Specific Methods (Un-Sup)' },
          
          // New nodes under Global Methods (Supervised Learning)
          { key: 'Partial Dependence Plot', parent: 'Global Methods', text: 'The partial dependence plot is a feature effect method.' },
          { key: 'Accumulated Local Effect Plots', parent: 'Global Methods', text: 'Accumulated local effect plots work when features are dependent.' },
          { key: 'Feature Interaction (H-statistic)', parent: 'Global Methods', text: 'Feature interaction (H-statistic) quantifies joint effects of features.' },
          { key: 'Functional Decomposition', parent: 'Global Methods', text: 'Functional decomposition breaks down complex prediction functions.' },
          { key: 'Permutation Feature Importance', parent: 'Global Methods', text: 'Permutation feature importance measures increase in loss when a feature is permuted.' },
          { key: 'Global Surrogate Models', parent: 'Global Methods', text: 'Global surrogate models replace the original model with a simpler one for interpretation.' },
          { key: 'Prototypes and Criticisms', parent: 'Global Methods', text: 'Prototypes and criticisms are representative data points used to enhance interpretability.' },

        //   Local Methods
        { key: 'Individual conditional expectation curves (ICE)', parent: 'Local Methods', text: 'The partial dependence plot is a feature effect method.' },
        { key: 'Local surrogate models (LIME)', parent: 'Local Methods', text: 'Accumulated local effect plots work when features are dependent.' },
        { key: 'Scoped rules (anchors)', parent: 'Local Methods', text: 'Feature interaction (H-statistic) quantifies joint effects of features.' },
        { key: 'Counterfactual explanations', parent: 'Local Methods', text: 'Functional decomposition breaks down complex prediction functions.' },
        { key: 'Shapley Values', parent: 'Local Methods', text: 'Permutation feature importance measures increase in loss when a feature is permuted.' }
        ],
        [
          { from: 'Start', to: 'Black Box Models' },
          { from: 'Start', to: 'Interpretable Models' },
          { from: 'Black Box Models', to: 'Statistical Learning' },
          { from: 'Interpretable Models', to: 'Statistical Learning' },
          { from: 'Statistical Learning', to: 'Supervised Learning' },
          { from: 'Statistical Learning', to: 'Un-supervised Learning' },
          { from: 'Supervised Learning', to: 'Model Agnostic Methods (Sup)' },
          { from: 'Supervised Learning', to: 'Model-Specific Methods (Sup)' },
          { from: 'Un-supervised Learning', to: 'Model Agnostic Methods (Un-Sup)' },
          { from: 'Un-supervised Learning', to: 'Model-Specific Methods (Un-Sup)' },
          { from: 'Model Agnostic Methods (Sup)', to: 'Global Methods' },
          { from: 'Model Agnostic Methods (Sup)', to: 'Local Methods' },
          { from: 'Model Agnostic Methods (Un-Sup)', to: 'Global Methods (Un-Sup)' },
          { from: 'Model Agnostic Methods (Un-Sup)', to: 'Local Methods (Un-Sup)' },
          
          // New links for Global Methods under Supervised Learning
          { from: 'Global Methods', to: 'Partial Dependence Plot' },
          { from: 'Global Methods', to: 'Accumulated Local Effect Plots' },
          { from: 'Global Methods', to: 'Feature Interaction (H-statistic)' },
          { from: 'Global Methods', to: 'Functional Decomposition' },
          { from: 'Global Methods', to: 'Permutation Feature Importance' },
          { from: 'Global Methods', to: 'Global Surrogate Models' },
          { from: 'Global Methods', to: 'Prototypes and Criticisms' },

            // New links for Local Methods under Supervised Learning

            { from: 'Local Methods', to: 'Individual conditional expectation curves (ICE)' },

            { from: 'Local Methods', to: 'Local surrogate models (LIME)' },

            { from: 'Local Methods', to: 'Scoped rules (anchors)' },

            { from: 'Local Methods', to: 'Counterfactual explanations' },

            { from: 'Local Methods', to: 'Shapley Values' }
        ]
      );
      
  
    // Collapse all nodes initially
    myDiagram.findTreeRoots().each(root => root.collapseTree(3));
  }
  
  window.addEventListener('DOMContentLoaded', init);




document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach((carouselWrapper) => {
    const carousel = carouselWrapper.querySelector('.carousel');
    const images = carouselWrapper.querySelectorAll('.carousel-image');
    const prevBtn = carouselWrapper.querySelector('.prev-btn');
    const nextBtn = carouselWrapper.querySelector('.next-btn');
    const codeBlocks = carouselWrapper.querySelectorAll('.code-content');
    let currentIndex = 0;

    // Check if there are images or buttons, otherwise don't run the carousel logic
    if (!carousel || images.length === 0 || !prevBtn || !nextBtn) {
      console.warn('Carousel structure is incomplete or missing elements.');
      return;
    }

    // Function to show only the current image
    function updateCarousel() {
      images.forEach((image, index) => {
        image.style.display = index === currentIndex ? 'block' : 'none';
      });
      updateCodeDisplay();
    }

    // Function to show the corresponding code block
    function updateCodeDisplay() {
      codeBlocks.forEach((code, index) => {
        code.style.display = index === currentIndex ? 'block' : 'none';
      });
    }

    // Show the next image
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    }

    // Show the previous image
    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel();
    }

    // Initialize the carousel by showing the first image and the corresponding code
    updateCarousel();

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
  });
});


function init2() {
  const $ = go.GraphObject.make;

  const myDiagram = $(go.Diagram, "myDiagramDiv2", {
    initialContentAlignment: go.Spot.Center,  // center diagram contents
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 }),  // tree layout
    "undoManager.isEnabled": true  // enable undo & redo
  });

  // Define node template with collapsibility and animations
  myDiagram.nodeTemplate =
    $(go.Node, "Horizontal",  // Tree node in a horizontal layout
      {
        isTreeExpanded: false,  // Initially collapsed
        selectionChanged: node => node.findTreeChildrenNodes().each(child => {
          const animation = new go.Animation();
          animation.add(child, "visible", !child.visible);  // toggle visibility of child nodes
          animation.start();
        })
      },
      // Panel for the node content
      $(go.Panel, "Auto",
        $(go.Shape, "Rectangle", { fill: "lightblue", stroke: "gray" }),
        $(go.TextBlock, { margin: 8, font: "bold 12px sans-serif", stroke: "black" },
          new go.Binding("text", "key"))  // Node key as text
      ),
      $("TreeExpanderButton", {
        width: 14,
        height: 14,
        margin: 5,
        click: (e, obj) => {
          const node = obj.part;
          if (node) {
            const diagram = node.diagram;
            diagram.startTransaction("collapse/expand");
            const expand = !node.isTreeExpanded;
            node.findTreeChildrenNodes().each(child => child.visible = expand);
            node.isTreeExpanded = expand;  // expand or collapse the node
            diagram.commitTransaction("collapse/expand");
          }
        }
      })
    );

  // Define link template
  myDiagram.linkTemplate =
    $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape, { strokeWidth: 2, stroke: "#555" })  // link shape
    );

  // Define the model with nodes and links
  myDiagram.model = new go.GraphLinksModel(
    [
      { key: 'Interaction Terms' },  // Root node
      { key: 'Constant Effect', parent: 'Interaction Terms' },
      { key: 'Individual Effects', parent: 'Interaction Terms' },
      { key: 'Interaction Effects', parent: 'Interaction Terms' },
      
      // Breakdown for Individual Effects
      { key: 'Effect of X1', parent: 'Individual Effects' },
      { key: 'Effect of X2', parent: 'Individual Effects' },
      
      // Breakdown for Interaction Effects
      { key: 'Interaction between X1 and X2', parent: 'Interaction Effects' },
    ],
    [
      { from: 'Interaction Terms', to: 'Constant Effect' },
      { from: 'Interaction Terms', to: 'Individual Effects' },
      { from: 'Interaction Terms', to: 'Interaction Effects' },
      
      // Links for Individual Effects
      { from: 'Individual Effects', to: 'Effect of X1' },
      { from: 'Individual Effects', to: 'Effect of X2' },
      
      // Links for Interaction Effects
      { from: 'Interaction Effects', to: 'Interaction between X1 and X2' }
    ]
  );
  
  // Collapse all nodes initially
  myDiagram.findTreeRoots().each(root => root.collapseTree(3));
}

window.addEventListener('DOMContentLoaded', init2);