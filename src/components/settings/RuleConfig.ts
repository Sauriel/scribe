import { Ruleset } from "@/models/AppDocumentSettings";

export const RULES = {
  DND_35E: new Ruleset("Dungeons & Dragons 3.5th Edition", "dnd-35", [], [], true),
  DND_4E: new Ruleset("Dungeons & Dragons 4th Edition", "dnd-4", [], [], true),
  DND_5E: new Ruleset("Dungeons & Dragons 5th Edition", "dnd-5", [ "BookSanity", "ScalySans", "ScalySansSmallCaps", "Solberry", "MrJeeves" ], [], false)
}

export const RULES_GROUPS = {
  DND: new Ruleset("Dungeons & Dragons", "dnd", [], [
    RULES.DND_35E,
    RULES.DND_4E,
    RULES.DND_5E
  ], false),
  PATHFINDER: new Ruleset("Pathfinder", "pf", [], [], true),
  CTHULHU: new Ruleset("Call of Cthulhu", "coc", [], [], true),
  CYBERPUNK: new Ruleset("Cyberpunk", "cp", [], [], true),
  WARHAMMER_40K: new Ruleset("Warhammer 40K", "wh40k", [], [], true),
  WORLD_OF_DARKNESS: new Ruleset("the World of Darkness", "wod", [], [], true)
}