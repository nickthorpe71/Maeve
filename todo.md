# TODO

[ ] get concurrency node example code
[ ] bring rest of program over from elixir env
[ ] convert everything to TS
[ ] track fight metadata
[ ] - move current health/endurance to metadata
[ ] - num hits, misses, crits per warrior
[ ] update battleState on end (winner/loser)
[ ] add reaction loop
[ ] warrior and warrior_battle_stats should become structs
[ ] if a warrior goes below a percentage of health we should check for a knockout or forefeit
[ ] create tournament and display result
[ ] make warriors able to breed
[ ] - After each fight they "breed" with their opponent over and over again until the new version of themself beats the old version. This represents them growing from the battle. Their battle brain should persist through each of these battles growing along the way.
[ ] add choices for warriors (action: attack, bide / reaction: block, dodge ) made randomly at first
[ ] add warrior brain during battle
[ ] add post battle evolution
[ ] reimplement database
[ ] track the progress of the stats and brain of a warrior as they evolve
[ ] create UI
[ ] ultimately warriors should try to predict what their opponent will do

[ ] EDGE CASES
[ ] when both warriors attack, the one who goes first should be the one with highest speed
