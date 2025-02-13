
import { basePath } from "../next.config";

const imgpath =  basePath+"/img/awards/"

const AwardsInfo =
{
	// Trofei
	gold:
	{
		name: "Primo posto",
		image: (anno)=> imgpath+anno+"/1.png"
	},
	silver:
	{
		name: "Quarto posto",
		image: (anno)=> imgpath+anno+"/2.png"
	},
	bronze:
	{
		name: "Terzo posto",
		image: (anno)=> imgpath+anno+"/3.png"
	},


	// Nomination classiche
	best_graphic: 
	{
		name: "Miglior Grafica",
		desc: "Nomination come miglior grafica"
	},
	
	best_sound: 
	{
		name: "Miglior Sonoro",
		descdesc: "Nomination come miglior sonoro"
	},
	
	best_gamepaly: 
	{
		name: "Migliore Giocabilità",
		desc: "Nomination come miglior giocabilità"
	},
	
	best_tecnique: 
	{
		name: "Miglior Tecnica",
		desc: "Nomination come miglior tecnica"
	},
	
	best_originality: 
	{
		name: "Miglior Originalità",
		desc: "Nomination come gioco più originale"
	},
	
	best_longevity: 
	{
		name: "Miglior Longevità",
		desc: "Nomination come gioco più longevo"
	},

	best_carisma:
	{
		name: "Miglior Carisma",
		desc: "Nomination come gioco più carismatico"
	},

	best_professionality:
	{
		name: "Miglior Professionalità",
		desc: "Nomination come gioco più professionale"
	},
}


export const Awards =
{
	//---------------------------------------------------- 2004

	// Canna-Pacman 3
	"23":
	[
		AwardsInfo.gold,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_originality,
		AwardsInfo.best_longevity
	],

	//The Katrix
	"144":
	[
		AwardsInfo.silver,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_tecnique
	],

	//Jack War
	"75":
	[
		AwardsInfo.bronze,
	],

	//---------------------------------------------------- 2005
	
	//Chao World 2
	"25":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_longevity
	],

	//Transfer
	"156":
	[
		AwardsInfo.silver,
		AwardsInfo.best_sound
	],

	//Cold Wind
	"30":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_tecnique
	],

	//Okkemon
	"99":
	[
		AwardsInfo.best_originality
	],


	//---------------------------------------------------- 2006
	
	//Cold Wind II
	"29":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_graphic,
		AwardsInfo.best_tecnique,
	],
	//FMT
	"58":
	[
		AwardsInfo.silver,
		AwardsInfo.best_sound,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_originality,
	],
	//Kocimory Island 
	"80":
	[
		AwardsInfo.gold,
		AwardsInfo.best_longevity,
	],


	//---------------------------------------------------- 2007
	
	//BWM
	"22":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_longevity,
	],
	//Jesolo Surf Game
	"76":
	[
		AwardsInfo.silver,
		AwardsInfo.best_sound,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_originality,
	],
	//Adventure
	"6":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_tecnique
	],

	

	//---------------------------------------------------- 2008
	
	//Echos
	"50":
	[
		AwardsInfo.silver,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_gamepaly
	],
	//Quantix
	"116":
	[
		AwardsInfo.best_gamepaly
	],
	//Alliance Bros
	"12":
	[
		AwardsInfo.best_gamepaly
	],
	//Chapta The Game
	"26":
	[
		AwardsInfo.gold,
		AwardsInfo.best_tecnique,
		AwardsInfo.best_originality
	],
	//Sonic
	"127":
	[
		AwardsInfo.best_longevity
	],
	//Robottino
	"122":
	[
		AwardsInfo.bronze
	],


	//---------------------------------------------------- 2009
	
	//ROBO RALLY
	"119":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_originality,
		
	],
	//THE TRICK
	"152":
	[
		AwardsInfo.best_gamepaly,
	],
	//MISTERING
	"91":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_gamepaly,
	],
	//ABSTRACT BINDINGS
	"4":
	[
		AwardsInfo.silver,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_longevity,
	],
	//NIGHTSTRIKE 2 FINAL
	"96":
	[
		AwardsInfo.best_tecnique,
	],


	//---------------------------------------------------- 2010
	
	//Hue
	"71":
	[
		AwardsInfo.silver,
		AwardsInfo.best_graphic,
	],
	//Flare Project
	"60":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_graphic,
		AwardsInfo.best_tecnique,
	],
	//Alliance Bros 2
	"11":
	[
		AwardsInfo.gold,
		AwardsInfo.best_sound,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_tecnique,
		AwardsInfo.best_originality,
		AwardsInfo.best_longevity,
	],
	

	//---------------------------------------------------- 2011
	
	//Whiteman Commando F.C.
	"164":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_tecnique,
	],
	//Soul
	"128":
	[
		AwardsInfo.best_tecnique,
		AwardsInfo.best_originality,
	],
	//TLOZ - Dark Order
	"149":
	[
		AwardsInfo.silver,
		AwardsInfo.best_tecnique,
	],
	//The last empire
	"147":
	[
		AwardsInfo.bronze,
	],

	//---------------------------------------------------- 2012
	
	

	//---------------------------------------------------- 2013
	
	//Whiteman Commando Flash Conflict 3
	"165":
	[
		AwardsInfo.silver,
		AwardsInfo.best_graphic,
		AwardsInfo.best_professionality,
	],
	//RoboRun
	"121":
	[
		AwardsInfo.gold,
		AwardsInfo.best_sound,
		AwardsInfo.best_longevity
	],
	//Gobble Wobble 2
	"64":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_gamepaly
	],
	//PinoWorker!
	"105":
	[
		AwardsInfo.best_carisma
	],


	//---------------------------------------------------- 2014
	
	//CESURA
	"24":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_longevity,
		AwardsInfo.best_carisma,
		AwardsInfo.best_professionality,
	],
	//Love test: the game
	"84":
	[
		AwardsInfo.silver,
		AwardsInfo.best_gamepaly,
		AwardsInfo.best_professionality,
	],
	//iPong: The Game
	"74":
	[
		AwardsInfo.bronze,
	],

	
	//---------------------------------------------------- 2015
	
	//Serious Zeb
	"125":
	[
		AwardsInfo.gold,
	],
	//Jim's Adventure
	"77":
	[
		AwardsInfo.silver,
	],
	//Minilistik
	"90":
	[
		AwardsInfo.bronze,
	],
	
	//---------------------------------------------------- 2016
	
	//Flipper
	"61":
	[
		AwardsInfo.gold,
	],
	//DMSystem
	"45":
	[
		AwardsInfo.silver,
	],
	//Abstract Arena
	"3":
	[
		AwardsInfo.bronze,
	],
	//---------------------------------------------------- 2017
	
	//Claire
	"28":
	[
		AwardsInfo.gold,
		AwardsInfo.best_graphic,
		AwardsInfo.best_sound,
		AwardsInfo.best_carisma,
		AwardsInfo.best_professionality,
	],
	//Ascent
	"16":
	[
		AwardsInfo.silver,
	],
	//Crash Reloaded
	"32":
	[
		AwardsInfo.bronze,
		AwardsInfo.best_longevity,
	],
	//Points of View
	"106":
	[
		AwardsInfo.best_gamepaly,
	],
	//---------------------------------------------------- 2018
	
	//
	"":
	[
	],
	//---------------------------------------------------- 2019
	
	//
	"":
	[
	],
	//---------------------------------------------------- 2020
	
	//48
	"1":
	[
		AwardsInfo.gold,
		{
			name: "Estetica più appagante"
		},
	],
	//Brutal
	"21":
	[
		AwardsInfo.silver,
	],
	
	//The Trick
	"153":
	[
		AwardsInfo.bronze,
	],
	//Messland
	"88":
	[
		{
			name: "Meccanica più originale"
		},
	],
	//Mr. Blond
	"92":
	[
		{
			name: "Miglior Easter Egg"
		},
	],
	//Feralliance
	"59":
	[
		{
			name: "Miglior matricola"
		},
	],
	//Deception
	"40":
	[
		{
			name: "Gioco più ambizioso"
		},
	],
	//MyQuest
	"93":
	[
		{
			name: "Miglior sound design"
		},
	],
	//P.A.C. Bandersnatch
	"102":
	[
		{
			name: "Miglior rigiocabilità"
		},
	],

}

