type GameData = 
{
	id: string;
	name: string;
	avg_score: string;
 };
 
 type JudgeData = 
 {
	id: string;
	name: string;
	votes_count: string;
 };
 
 type Results = 
 {
	success: boolean;
	games_data: GameData[];
	judges_data: JudgeData[];
	games_count: number;
	public: boolean;
 };

type Partecipation =
{
	contest_id: string;
	game_desc: string;
	game_id: string;
	game_name: string;
	game_short_desc: string;
	game_thumbnail: string;
	game_url: string;
	host: string;
	kind: string;
	user_id: string;
}

type Game =
{
	id: number; // L'ID del gioco
	name: string; // Il nome del gioco
	contest_id: number; // L'ID della competizione
	image_url: string; // L'URL dell'immagine del gioco
	short_description: string; // La descrizione breve del gioco
	description: string; // La descrizione dettagliata del gioco
	authors: string; // Gli autori del gioco
	download_url: string; // L'URL per il download del gioco
	placement: number; // La posizione del gioco nella competizione
}

type Contest =
{
	id: number; // L'ID della competizione
	name: string; // Il nome della competizione
	end_at: string; // La data di fine della competizione
	can_submit: boolean; // Se è possibile sottomettere giochi
	completed_at: string; // La data di completamento della competizione
	public: string; // Se la competizione è pubblica
	is_ended: boolean; // Se la competizione è terminata
	is_completed: boolean; // Se la competizione è completata
}

type Participant =
{
	id: string; // L'ID del partecipante
	user_name: string; // Il nome utente del partecipante
	user_discord_id: string; // L'ID Discord del partecipante
	contest_id: string; // L'ID della competizione
	kind: string; // Tipo di partecipante
}

type Vote =
{
	user_id: string; // L'ID dell'utente che ha votato
	game_id: string; // L'ID del gioco votato
	created_at: string; // La data in cui il voto è stato creato
	updated_at: string; // La data dell'aggiornamento del voto
	score: string; // Il punteggio assegnato al gioco
	comment: string; // Il commento lasciato dall'utente
	pros: string[]; // I punti positivi menzionati nel voto
	cons: string[]; // I punti negativi menzionati nel voto
	judge_name: string; // Il nome del giudice
}


type User =
{
	id: number; // ID dell'utente
	name: string; // Nome dell'utente
	discord_id: bigint; // Discord ID
	avatar: string;
	forum_id: number | null; // Forum ID (può essere null se non presente)
	game_count: number; // Numero di giochi presentati
	judge_count: number; // Numero di volte giudice in contest distinti
	top_game_count: number; // Numero di giochi con placement = 
}


type UserInfo =
{
	user_id: string
	user_name: string
	user_discord_id: string
	user_forum_id: string
	games: Game[]
	user_avatar: string
	votes: [{contest_id: number}]
}

type AccountInfo = 
{
	user_id: string;
	forum_id: string | null;
	discord_info:
	{
		id: string;
		username: string;
		avatar: string;
		discriminator: string;
		public_flags: number;
		flags: number;
		banner: string | null;
		accent_color: number | null;
		global_name: string;
		avatar_decoration_data: string | null;
		banner_color: string | null;
		clan: string | null;
		primary_guild: string | null;
		mfa_enabled: boolean;
		locale: string;
		premium_type: number;
	};
};

type UserMedals =
{
	most_participations: boolean,
	most_first_places: boolean,
	most_second_places: boolean,
	most_third_places: boolean,
	most_last_places: boolean,
	participated_first_competition: boolean,
	has_been_judge: boolean,
	most_times_judge: boolean
}