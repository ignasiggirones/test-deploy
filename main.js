// GLOBAL VARIABLES

const column_names = ['muscle_group', 'exercise', 'level', 'push_pull',
'modality', 'joint']
const dictionary = {
    'fw': "free weight",
    'c': "cables",
    'ma': "machine",
    'm': "multiarticular",
    's': "single-joint, isolation",
    'abdominals - lower': 'abdominals_lower',
    'abdominals - obliques': 'abdominals_obliques',
    'abdominals - total': 'abdominals_total',
    'abdominals - upper': 'abdominals_upper',
    'back - latissimus dorsi': 'back_latissimus_dorsi',
    'back - lat.dorsi/rhomboids': 'back_latdorsi_rhomboids',
    'biceps': 'biceps',
    'calves - gastrocnemius': 'calves_gastrocnemius',
    'calves - soleus': 'calves_soleus',
    'chest - pectoralis': 'chest_pectoralis',
    'forearms': 'forearms',
    'glutes': 'glutes',
    'legs - hamstrings': 'legs_hamstrings',
    'legs - quadriceps': 'legs_quadriceps',
    'lower back - erector spinae': 'lower_back_erector_spinae',
    'shoulders - delts/traps': 'shoulders_delts_traps',
    'triceps': 'triceps'
}
const strength = {
    "reps": [1, 0.8, 0.6, 0.6, 0.4],
    "rir": "0-3",
    "rest": "2-5 min"
}
const hypertrophy = {
    "reps": [0.8, 0.8, 0.9, 0.8, 0.4],
    "rir": "0-4",
    "rest": "1-1.5 min"
}
const endurance = {
    "reps": [0.4, 0.6, 0.6, 0.8, 1],
    "rir": "0-2",
    "rest": "2-2.5 min"
}
const wrapper = document.querySelector('.input_box')

// INPUT UNSELECT

let inputs = document.querySelectorAll('.input_box input');
inputs.forEach(input => {
    if(input.type == "radio"){
        input.addEventListener('click', (e) => {
            if(e.ctrlKey){
                e.target.checked = false
            }
        })
    }
})

// RESULTS FUNCTIONS

function fireUp(){
    let forms = document.querySelectorAll('form')
    let checkbox_inputs = []
    let checked_inputs = []
    checked_inputs[0] = checkbox_inputs
    forms.forEach((form, i) => {
        let do_null = true;
        let inputs = form.querySelectorAll('input')
        inputs.forEach(input => {
            if (input.type == "checkbox"){
                if (input.checked){
                    do_null = false
                    checkbox_inputs.push(input.value)

                }
            } else if(input.checked || input.name == "text_input"){
                do_null=false
                checked_inputs.push(input.value.toLowerCase())
                
            }
        })
        if (i == 0 && checkbox_inputs.length == 0){
            checked_inputs.shift()
        }
        if(do_null){
            checked_inputs.push(null)
        }

    })
    document.querySelector('.fa-circle-down').classList.remove('visible')
    lookUpFor(checked_inputs, 'db/exercises_db2.json')
}

async function lookUpFor(values, db){
    const List = document.querySelector('.list')
    List.innerHTML = ''
    const output = []
    const response = await fetch(db)
    const data = await response.json()
    let answers = 0
    let total_entries = 0;

    data.filter(item => {
        if(values[0] != null){
            for(i = 0; i < values[0].length; i++){
                if(item[column_names[0]].includes(values[0][i])){
                    for(j = 1; j < column_names.length; j++){
                        if (values[j] != null){
                            total_entries++;
                            if(item[column_names[j]].includes(values[j])){
                                answers++
                            }
                        }
                    }
                }
            } 
        } else {
            for(j = 1; j < column_names.length; j++){
                if (values[j] != null){
                    total_entries++;
                    if(item[column_names[j]].includes(values[j])){
                        answers++
                    }
                }
            }
        }

        if (answers == total_entries && total_entries != 0){
            if(item.joint === "m"){
                output.unshift(item)
            } else{
                output.push(item)
            }

        }
        
        answers = 0;
        total_entries = 0;

    })
    
    

    output.forEach(element => {
        const newDiv = document.createElement('div')
        const newListElement = document.createElement('li')
        const newimage = document.createElement('img')
        const resultsTitle = document.querySelector('.results h1')
        resultsTitle.classList.add('visible')
        newimage.setAttribute('alt', element.exercise)
        newimage.addEventListener('click', (e) => {
            const image = document.querySelector('.image_pop_up img')
            image.setAttribute('src', e.target.src)
            const img_pu = document.querySelector('.image_pop_up')
            img_pu.classList.add('visible')
        })
        
        newListElement.classList.add('exercise_li')
        newListElement.innerHTML = `<span class="ex_name"> ${element.exercise} </span> <br />Muscle Group: <span class="muscle_name">${element.muscle_group}</span> <br />Level: ${element.level} <br />Push/Pull: ${element.push_pull} <br />Modality: ${dictionary[element.modality]} <br />Joint: ${dictionary[element.joint]} <br />
        `
        
        newListElement.addEventListener('click', () => {
            showPopUp(element, newListElement)
        });
        
        newDiv.append(newListElement)
        if (element.image != null || element.image != undefined){
            newimage.setAttribute('src', element.image)
            newDiv.append(newimage)
        }
        List.append(newDiv)
    })

    const results = document.querySelector('.results h1')
    results.scrollIntoView({block: "start", behavior: "smooth"})

    if(output.length == 0){
        results.textContent = 'Not found, try change your options'
    } else{
        results.textContent = 'Results'

    }
    
}

document.addEventListener('keypress', (e) => {
    if(e.key == 'Enter'){
        fireUp()
        e.preventDefault()
    }
})
// POP-UP

const popUp = document.querySelector('.pop_up_wrapper')
function showPopUp(element, item){
    popUp.classList.add('visible')
    const popUpData = document.querySelector('.popup_data')
    popUpData.textContent = element.exercise;
    const specs = document.querySelector('.specs')
    specs.innerHTML = `
                <h4>Exercise specifications</h4>
                <li>Muscle group: ${element.muscle_group}</li>
                <li>Level: ${element.level} </li>
                <li>Push/Pull: ${element.push_pull}</li>
                <li>Modality: ${dictionary[element.modality]}</li>
                <li>Joints involved: ${dictionary[element.joint]}</li>
                <li>Target: ${element.target}</li>`;
    let muscle_target = document.querySelector('#pu'+dictionary[item.querySelector('.muscle_name').textContent])
    for(i = 0; i < muscle_target.children.length; i++){
        muscle_target.children[i].classList.add('muscle_selected')
    }
}

const xcross = document.querySelector('.fa-circle-xmark')
xcross.addEventListener('click', () => {
    popUp.classList.remove('visible')
    let muscle_targ = document.querySelector('.pop_up_wrapper').querySelectorAll('.muscle_selected');
    for(i = 0; i < muscle_targ.length; i++){
        muscle_targ[i].classList.remove('muscle_selected')
    }
})

const rir = document.querySelector('.rir');
const rest = document.querySelector('.rest');

function objectiveSet(objective, target){
    const targets = document.querySelectorAll('.objective button')
    targets.forEach(target => {target.classList.remove('active_button')})
    target.classList.add('active_button')
    const repRanges = document.querySelectorAll('.series-display li')
    repRanges.forEach((range, i) => {
        range.style.background = `rgba(355, 355, 355, ${objective.reps[i]-0.35})` 
    })
    rir.textContent = objective.rir;
    rest.textContent = objective.rest;
}

const strengthButton = document.querySelector('.strength')
const hypertrophyButton = document.querySelector('.hypertrophy')
const enduranceButton = document.querySelector('.endurance')


strengthButton.addEventListener('click', (e) => {
    objectiveSet(strength, e.target)
})

hypertrophyButton.addEventListener('click', (e) => {
    objectiveSet(hypertrophy, e.target)
})

enduranceButton.addEventListener('click', (e) => {
    objectiveSet(endurance, e.target)
})

let pop_upsvg = document.querySelector('.pop_up_svg')
pop_upsvg.style.width = document.querySelector('.img_container').clientWidth;


window.onresize = () => {
    let pop_upsvg = document.querySelector('.pop_up_svg')
    pop_upsvg.style.width = document.querySelector('.img_container').clientWidth;
}

// IMAGE POP-UP

const image_pop_up = document.querySelector('.image_pop_up')
const image_p = document.querySelector('.image_pop_up img')
image_pop_up.addEventListener('click', () => {
    image_pop_up.classList.remove('visible')
})

// INTERACTIVE SVG

let checkboxs = document.querySelectorAll('input[type="checkbox"]')
let gs = document.querySelectorAll('.muscle_group')

gs.forEach( g => {
    g.addEventListener("click", e => {
        let checkbox_selected = document.querySelector('.'+e.target.parentNode.id)
        if (checkbox_selected.checked == true){
            checkbox_selected.checked = false
            for(i = 0; i < e.target.parentNode.children.length; i++){
                e.target.parentNode.children[i].classList.remove('muscle_selected')
            }
        } else {
            checkbox_selected.checked = true
            for(i = 0; i < e.target.parentNode.children.length; i++){
                e.target.parentNode.children[i].classList.add('muscle_selected')
                
            }
        }
    })
})


checkboxs.forEach( checkbox => {
    checkbox.addEventListener("click", (e) => {
            let objs = document.querySelector('#'+e.target.className).getElementsByTagName('path')
            for(i = 0; i < objs.length; i++){
                objs[i].classList.toggle('muscle_selected')
            }
    });
})

// MENU

const menu = document.querySelector('.fa-bars')
menu.addEventListener('click', () => {
    const menuBar = document.querySelector('.menu')
    menuBar.classList.toggle('menubar')
})


// TIPPY IMPLEMENTATION

const tippy_buttons = document.querySelectorAll('.tippy')
const tippy_data = [
    'This information tag will show you how to navigate through our website. First of all, select the muscle group/s that your want to workout from the checkbox or clicking our interactive body model. Afterwards, select other features your can find useful (click "ctrl" to unselect any radio input). If you want to get any information of what does something means, hover on the information buttons you will find in our page.',
    'A way of classifying gym exercises is by the type of movement we do, how do we deal with weight, pushing or pulling it for example, by doing exercises with the same motor movement we can get a targeted muscular tension.',
    'Depending on the impact an exercise has in front of their bounding muscles we can define it in two ways: single-jointed or multi-joined. A multiarticular exercise will require more muscular fibres, so it will stimulate other muscles to help, that means that it will be much more demanding from our muscular system, so they have to be performed in the beggining of our workout ("Multiarticular" exercises will be shown first in your research results) in order to be done properly and effectively. Single-jointed or Isolation exercises are meant to complement the other type we have told you about, to get a much more detailed experience and focused muscular development.',
    "When it comes to training with weights there are 3 main objectives which people are looking up to: Strength -> trying to be as strong as possible and try lifting heavier wheight. Hypertrophy -> gain as much muscle mass as possible, mostly to have an personally aesthetic body. Endurance -> capacity to resist wheight for long periods of time, the main application is to improve your performance at a particular sport",
    "The range of repetitions of an exercise is a very important variable which is related with the muscular tension and metabolic stress we want to apply on our exercices in order to get differents results, such as building strength, muscle mass, resistance, power... So in order to get that desired results we should keep track of our series and repetitions in every exercise.",
    "RIR refers to Repetitions in Reserve, a term related with the intensity of your workout. This scale measures how many more repetitions can you do based on your muscular fatigue, a RIR 0 means the same as the term 'muscular failure', a state where you can't do an entire repetition. An exercise should be done between the RIR 0-5 to really create muscular tension, although an abuse of using the RIR 0 can be harmful and counter-productive.",
    "Rest time is such an important variable to keep up with your workout, your muscular fosfagen levels return at their previous level within 3 minutes, but on that time, muscular tension is lost, so that lets us to have a balance between those two values in order of the results we are looking for and don't lose much time doing nothing in the gym."

]


tippy_buttons.forEach((tippy_btn, i) => {
    tippy('#'+tippy_btn.id, {
        content: tippy_data[i],
        arrow: true,
        arrowType: 'round'
    })
})

// FLOATING ARROW

const floatArrow = document.querySelector('.fa-circle-down')
const final = document.querySelector('.searcher')
floatArrow.addEventListener('click', () => {
    final.scrollIntoView({block: "end", behavior: "smooth"})
    floatArrow.classList.remove('visible')
})

window.addEventListener('scroll', () => {
    floatArrow.classList.remove('visible')
})
