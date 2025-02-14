
import { basePath } from "../next.config";

export const MedalsInfo = 
{
	gold:  
	{
		name: "Primo posto",
		desc: "Premio per una vittoria del primo posto",
		image:  basePath+"/img/medals/gold.png"
	},
	silver:  
	{
		name: "Secondo posto",
		desc: "Premio per una vittoria del secondo posto",
		image:  basePath+"/img/medals/silver.png"
	},
	bronze:  
	{
		name: "Terzo posto",
		desc: "Premio per una vittoria del terzo posto",
		image:  basePath+"/img/medals/bronze.png"
	},


	first_contest:  
	{
		name: "Ghianda d'argento della partecipazione",
		desc: "Riconoscimento per un utente che ha partecipato almeno una volta alla compe",
		image:  basePath+"/img/medals/ancorn_silver.png"
	},
	most_contest:  
	{
		name: "Ghianda d'oro della partecipazione",
		desc: "Riconoscimento per un utente che ha partecipato per tantissimi anni alla compe",
		image:  basePath+"/img/medals/ancorn_gold.png"
	},


	first_judge:  
	{
		name: "Piuma d'argento del giudizio",
		desc: "Riconoscimento per un utente che ha fatto da giudice alla compe almeno una volta",
		image:  basePath+"/img/medals/feather_silver.png"
	},
	most_judge:  
	{
		name: "Piuma d'oro del giudizio",
		desc: "Riconoscimento per un utente che ha fatto da giudice alla compe per tantissimi anni",
		image:  basePath+"/img/medals/feather_gold.png"
	},
	
	
	first_coop:  
	{
		name: "Anello d'argento della collaborazione",
		desc: "Riconoscimento per un utente che ha partecipato insieme a qualcun'altro per la prima volta alla compe",
		image:  basePath+"/img/medals/ring_silver.png"
	},
	most_coop:  
	{
		name: "Anello d'oro della collaborazione",
		desc: "Riconoscimento per un utente che ha partecipato insieme a qualcun'altro per tantissimi anni alla compe",
		image: basePath+"/img/medals/ring_gold.png"
	}
}