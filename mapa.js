/* mapa.js — aba "Mapas" do animalysson RPG: criador de mapas do mundo + modo ADM.
 * Uso: MapEditor.mount(elemento) ao abrir a aba; MapEditor.unmount() ao sair. */
(function(){
'use strict';
var KEY='animalysson-mundo-v1',M=1.5;
// [nome, cor, custo em quadrados]; -1 = bloqueado. Terreno difícil custa 1 quadrado extra (PHB 2024).
var T=[['Vazio','#0b0b0c',-1],['Grama','#3f7d3a',1],['Terra','#8a6a43',1],['Areia','#cdb878',1],['Pedra','#7a7a80',1],['Água rasa','#3b7fc4',2],['Água funda','#1f4e8c',2],['Floresta densa','#1f4d2a',2],['Neve','#e6eef5',2],['Parede','#3a3a40',-1]];
var SZ={Tiny:1,Small:1,Medium:1,Large:2,Huge:3,Gargantuan:4};
var TOMB_TILES=[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,9,4,4,9,9,4,4,9,4,4,4,4,9,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,4,9,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,9,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,4,9,4,4,9,9,9,9,9,9,9,9,9,4,4,9,9,9,4,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,4,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,9,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,9,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,9,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,9,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,9,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,9,9,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,9,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,4,4,4,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,4,4,4,4,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,4,9,4,4,9,9,9,4,4,4,4,4,9,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,4,9,4,4,9,9,9,4,4,4,4,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,4,4,9,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,4,9,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,4,4,4,4,9,4,9,4,4,4,4,4,4,4,4,9,9,9,4,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,4,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,9,9,9,9,4,4,9,9,9,9,4,4,9,4,4,4,4,4,9,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,9,4,4,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,4,4,9,9,9,9,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,9,4,4,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,9,9,4,9,4,4,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,4,4,4,9,4,4,9,9,9,4,9,9,4,4,4,4,4,9,4,9,9,4,9,4,9,4,9,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,9,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,9,4,9,9,4,4,9,4,4,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,4,9,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,4,4,4,9,9,4,9,4,4,4,9,9,9,4,4,4,9,4,4,9,4,4,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,9,4,4,9,9,9,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,4,4,9,4,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,4,9,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,4,4,9,4,4,9,4,4,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,9,4,4,4,9,4,4,4,4,9,9,4,4,4,9,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,4,4,4,9,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,4,4,9,9,9,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,9,9,9,9,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,9,9,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,4,4,4,4,4,4,4,4,4,4,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9];

function novoMapa(nome,w,h){w=w||40;h=h||30;var t=[];for(var i=0;i<w*h;i++)t.push(1);return{id:'m'+Date.now().toString(36),nome:nome,w:w,h:h,tiles:t,monsters:[],spawn:{x:w>>1,y:h>>1}}}
function load(){try{var w=JSON.parse(localStorage.getItem(KEY));return w&&w.maps&&w.maps.length?w:null}catch(e){return null}}
function makeTomb(){
  return {id:'tomb-of-horrors',nome:'Tumba dos Horrores',w:72,h:95,tiles:TOMB_TILES.slice(),monsters:[],spawn:{x:35,y:88}};
}
var world=load()||{v:1,nome:'Meu mundo',maps:[novoMapa('Mapa 1'),makeTomb()]};
// Garante que o mapa da Tumba exista mesmo em saves antigos
(function(){
  if(!world.maps.some(function(m){return m.id==='tomb-of-horrors'||m.nome==='Tumba dos Horrores';})){
    world.maps.push(makeTomb());
    try{localStorage.setItem(KEY,JSON.stringify(world))}catch(e){}
  }
})();
var cur=0,tool='pintar',terr=1,zoom=1,ox=20,oy=20,selM=null,undo=[],drag=null,space=false,play=false,p={x:0,y:0},rest=0,vel=9,lim=false;
var R=null,cv=null,cx=null;
function $(s){return R.querySelector(s)}
function map(){return world.maps[cur]}
function cs(){return 32*zoom}
function save(){try{localStorage.setItem(KEY,JSON.stringify(world))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

function draw(){
  if(!cv)return;
  var d=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;
  if(cv.width!==Math.round(W*d)||cv.height!==Math.round(H*d)){cv.width=Math.round(W*d);cv.height=Math.round(H*d)}
  cx.setTransform(d,0,0,d,0,0);cx.fillStyle='#0b0b0c';cx.fillRect(0,0,W,H);
  var m=map(),c=cs(),x,y;
  for(y=0;y<m.h;y++)for(x=0;x<m.w;x++){cx.fillStyle=T[m.tiles[y*m.w+x]][1];cx.fillRect(ox+x*c,oy+y*c,c+.5,c+.5)}
  if(c>=14){cx.strokeStyle='rgba(0,0,0,.35)';cx.lineWidth=1;cx.beginPath();
    for(x=0;x<=m.w;x++){cx.moveTo(ox+x*c,oy);cx.lineTo(ox+x*c,oy+m.h*c)}
    for(y=0;y<=m.h;y++){cx.moveTo(ox,oy+y*c);cx.lineTo(ox+m.w*c,oy+y*c)}
    cx.stroke()}
  cx.textAlign='center';cx.textBaseline='middle';
  if(!play){cx.fillStyle='#ffd24a';cx.font='bold '+(c*.8)+'px sans-serif';cx.fillText('★',ox+(m.spawn.x+.5)*c,oy+(m.spawn.y+.5)*c)}
  m.monsters.forEach(function(o){
    var s=o.tam*c;cx.fillStyle='rgba(197,49,49,.9)';cx.strokeStyle='#fff';cx.lineWidth=2;
    cx.beginPath();cx.arc(ox+(o.x+o.tam/2)*c,oy+(o.y+o.tam/2)*c,s/2-2,0,7);cx.fill();cx.stroke();
    cx.fillStyle='#fff';cx.font='bold '+Math.max(9,c*.4)+'px sans-serif';cx.fillText(o.nome.slice(0,2),ox+(o.x+o.tam/2)*c,oy+(o.y+o.tam/2)*c)});
  if(play){cx.fillStyle='#2f7bff';cx.strokeStyle='#fff';cx.lineWidth=2;cx.beginPath();cx.arc(ox+(p.x+.5)*c,oy+(p.y+.5)*c,c/2-2,0,7);cx.fill();cx.stroke();
    cx.fillStyle='#fff';cx.font='bold '+Math.max(9,c*.4)+'px sans-serif';cx.fillText('ADM',ox+(p.x+.5)*c,oy+(p.y+.5)*c)}
  $('#mp-st').textContent=m.nome+' · '+m.w+'×'+m.h+' ('+(m.w*M)+' m × '+(m.h*M)+' m)';
}
function cell(e){var r=cv.getBoundingClientRect();return{x:Math.floor((e.clientX-r.left-ox)/cs()),y:Math.floor((e.clientY-r.top-oy)/cs())}}
function inb(c){return c.x>=0&&c.y>=0&&c.x<map().w&&c.y<map().h}
function snap(){undo.push({i:cur,t:map().tiles.slice(),m:JSON.stringify(map().monsters),s:map().spawn});if(undo.length>40)undo.shift()}
function monAt(x,y){var L=map().monsters;for(var i=L.length-1;i>=0;i--){var o=L[i];if(x>=o.x&&x<o.x+o.tam&&y>=o.y&&y<o.y+o.tam)return i}return -1}
function act(e){
  var c=cell(e),m=map();if(!inb(c))return;
  if(tool==='pintar'||tool==='apagar'){
    var n=+$('#mp-bs').value,v=tool==='pintar'?terr:0,a=c.x-((n-1)>>1),b=c.y-((n-1)>>1);
    for(var y=b;y<b+n;y++)for(var x=a;x<a+n;x++)if(x>=0&&y>=0&&x<m.w&&y<m.h)m.tiles[y*m.w+x]=v;
  }else if(tool==='monstro'){
    if(!selM)return;m.monsters.push({mid:selM.id,nome:selM.nome,tam:SZ[selM.tamanhoEn]||1,x:c.x,y:c.y});
  }else if(tool==='remover'){var i=monAt(c.x,c.y);if(i>=0)m.monsters.splice(i,1)}
  else if(tool==='inicio'){m.spawn={x:c.x,y:c.y}}
  draw();
}

// ---- Modo ADM: anda pelo mapa com as regras de deslocamento do D&D 2024 ----
function custo(x,y){var m=map();return x<0||y<0||x>=m.w||y>=m.h?-1:T[m.tiles[y*m.w+x]][2]}
function passo(dx,dy){
  var nx=p.x+dx,ny=p.y+dy,c=custo(nx,ny);
  if(c<0||monAt(nx,ny)>=0)return;
  if(dx&&dy&&(custo(p.x+dx,p.y)<0||custo(p.x,p.y+dy)<0))return; // não corta quina de parede
  var gasto=c*M;
  if(lim&&rest<gasto-1e-9)return;
  rest=Math.max(0,rest-gasto);p.x=nx;p.y=ny;hud();center();
}
function center(){var r=cv.getBoundingClientRect();ox=r.width/2-(p.x+.5)*cs();oy=r.height/2-(p.y+.5)*cs();draw()}
function hud(){
  var h=$('#mp-hud');
  h.innerHTML='<b>Modo ADM</b> — '+esc(map().nome)+' ('+p.x+', '+p.y+')<br>Deslocamento restante: <b>'+rest.toFixed(1).replace('.',',')+' m</b> de '+vel+' m<br>'+
  '<label><input type="checkbox" id="mp-lim"'+(lim?' checked':'')+'> Limitar ao deslocamento</label> '+
  '<label>Veloc. (m) <input id="mp-vel" type="number" min="0" step="1.5" value="'+vel+'" style="width:64px"></label> '+
  '<button id="mp-nt">Novo turno</button><br><small>WASD/setas (Q E Z C diagonais) ou toque numa casa vizinha</small>';
  $('#mp-lim').onchange=function(){lim=this.checked};
  $('#mp-vel').onchange=function(){vel=+this.value||0;rest=vel;hud()};
  $('#mp-nt').onclick=function(){rest=vel;hud()};
}
function setPlay(on){
  play=on;R.classList.toggle('mp-play',on);var b=$('#mp-bp');b.textContent=on?'Voltar ao editor':'Entrar como ADM';b.classList.toggle('on',!on);
  if(on){p={x:map().spawn.x,y:map().spawn.y};rest=vel;hud();center()}else draw();
}
var KM={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0],q:[-1,-1],e:[1,-1],z:[-1,1],c:[1,1]};
function onKey(e){
  if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)&&e.target.type!=='checkbox')return;
  if(e.code==='Space'){space=true;e.preventDefault();return}
  if((e.ctrlKey||e.metaKey)&&e.key==='z'){doUndo();e.preventDefault();return}
  var k=KM[e.key];if(play&&k){e.preventDefault();passo(k[0],k[1])}
}
function onKeyUp(e){if(e.code==='Space')space=false}

// ---- Painel ----
function pal(){
  $('#mp-pal').innerHTML=T.map(function(t,i){return '<button data-i="'+i+'" class="'+(i===terr?'on':'')+'"><i style="background:'+t[1]+'"></i>'+t[0]+'<small>'+(t[2]<0?'bloqueia':t[2]>1?'difícil':'normal')+'</small></button>'}).join('');
}
function setTool(t){tool=t;R.querySelectorAll('#mp-tools button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)})}
function busca(){
  var q=$('#mp-q').value.trim().toLowerCase(),L=(window.MONSTERS||[]).filter(function(m){return!q||(m.nome+' '+m.nomeEn).toLowerCase().indexOf(q)>=0}).slice(0,40);
  $('#mp-ml').innerHTML=L.length?L.map(function(m){return '<button data-id="'+esc(m.id)+'">'+esc(m.nome)+'<small>ND '+esc(m.nd)+' · '+esc(m.tamanho)+'</small></button>'}).join(''):'<small>'+(window.MONSTERS?'Nenhum resultado':'monsters.js não carregado')+'</small>';
}
function doUndo(){var u=undo.pop();if(!u||u.i!==cur)return;var m=map();m.tiles=u.t;m.monsters=JSON.parse(u.m);m.spawn=u.s;save();draw()}
function lista(){$('#mp-ms').innerHTML=world.maps.map(function(m,i){return '<option value="'+i+'"'+(i===cur?' selected':'')+'>'+esc(m.nome)+'</option>'}).join('')}

function mount(el){
  R=el;
  R.innerHTML='<div class="mp'+(play?' mp-play':'')+'" id="mp-root">'+
  '<div class="mp-bar"><select id="mp-ms" title="Mapas do mundo"></select>'+
  '<button id="mp-bn">Novo mapa</button><button id="mp-br">Renomear</button><button id="mp-bd">Excluir</button><button id="mp-bu">Desfazer</button>'+
  '<button id="mp-bx">Exportar</button><button id="mp-bi">Importar</button><button id="mp-bp" class="on">Entrar como ADM</button>'+
  '<input type="file" id="mp-fi" accept=".json" hidden></div>'+
  '<div class="mp-wrap"><aside class="mp-side" id="mp-edit">'+
  '<div><h4>Ferramentas</h4><div class="mp-g" id="mp-tools"><button data-t="pintar" class="on">Pintar</button><button data-t="apagar">Apagar</button><button data-t="monstro">Monstro</button><button data-t="remover">Remover</button><button data-t="inicio">Início</button><button data-t="mao">Mover vista</button></div>'+
  '<label style="display:block;margin-top:6px">Pincel <select id="mp-bs"><option value="1">1×1</option><option value="2">2×2</option><option value="3">3×3</option><option value="5">5×5</option></select></label></div>'+
  '<div><h4>Terreno (custo de movimento)</h4><div id="mp-pal"></div></div>'+
  '<div><h4>Monstros (SRD 5.2.1)</h4><input id="mp-q" placeholder="Buscar monstro…" style="width:100%;margin-bottom:4px"><div id="mp-ml"></div><small id="mp-sel">Nenhum selecionado</small></div>'+
  '<small>1 quadrado = 1,5 m (5 pés). Roda do mouse ou botões para zoom; botão direito arrasta a vista.</small>'+
  '<div class="mp-g"><button id="mp-zo">−</button><button id="mp-zi">+</button></div></aside>'+
  '<div class="mp-main"><canvas id="mp-cv"></canvas><div id="mp-hud"></div><div id="mp-st"></div></div></div></div>';
  cv=$('#mp-cv');cx=cv.getContext('2d');
  cv.addEventListener('pointerdown',function(e){
    cv.setPointerCapture(e.pointerId);
    var pan=tool==='mao'||e.button>0||space;
    if(play&&!pan){var c=cell(e),dx=c.x-p.x,dy=c.y-p.y;if(Math.abs(dx)<=1&&Math.abs(dy)<=1)passo(dx,dy);return}
    if(pan||play){drag={pan:1,x:e.clientX,y:e.clientY,ox:ox,oy:oy};return}
    snap();drag={};act(e);
  });
  cv.addEventListener('pointermove',function(e){
    if(!drag)return;
    if(drag.pan){ox=drag.ox+e.clientX-drag.x;oy=drag.oy+e.clientY-drag.y;draw()}
    else if(tool==='pintar'||tool==='apagar')act(e);
  });
  cv.addEventListener('pointerup',function(){drag=null;save()});
  cv.addEventListener('contextmenu',function(e){e.preventDefault()});
  cv.addEventListener('wheel',function(e){e.preventDefault();zoom=Math.min(3,Math.max(.3,zoom*(e.deltaY<0?1.1:.9)));draw()},{passive:false});
  $('#mp-zi').onclick=function(){zoom=Math.min(3,zoom*1.2);draw()};
  $('#mp-zo').onclick=function(){zoom=Math.max(.3,zoom/1.2);draw()};
  $('#mp-pal').onclick=function(e){var b=e.target.closest('button');if(!b)return;terr=+b.dataset.i;if(tool!=='pintar')setTool('pintar');pal()};
  $('#mp-tools').onclick=function(e){var b=e.target.closest('button');if(b)setTool(b.dataset.t)};
  $('#mp-q').oninput=busca;
  $('#mp-ml').onclick=function(e){var b=e.target.closest('button');if(!b)return;
    selM=(window.MONSTERS||[]).filter(function(m){return m.id===b.dataset.id})[0]||null;
    var n=selM?(SZ[selM.tamanhoEn]||1):1;
    $('#mp-sel').textContent=selM?'Selecionado: '+selM.nome+' ('+selM.tamanho+', '+n+'×'+n+' quadrados)':'';
    if(selM)setTool('monstro')};
  $('#mp-bu').onclick=doUndo;
  $('#mp-ms').onchange=function(){cur=+this.value;undo=[];draw()};
  $('#mp-bn').onclick=function(){
    var n=prompt('Nome do novo mapa:','Mapa '+(world.maps.length+1));if(!n)return;
    var w=parseInt(prompt('Largura em quadrados (1 quadrado = 1,5 m):','40'),10)||40,h=parseInt(prompt('Altura em quadrados:','30'),10)||30;
    world.maps.push(novoMapa(n,Math.min(200,Math.max(5,w)),Math.min(200,Math.max(5,h))));cur=world.maps.length-1;undo=[];save();lista();draw();
  };
  $('#mp-br').onclick=function(){var n=prompt('Novo nome:',map().nome);if(n){map().nome=n;save();lista();draw()}};
  $('#mp-bd').onclick=function(){
    if(world.maps.length<2){alert('O mundo precisa ter pelo menos um mapa.');return}
    if(confirm('Excluir o mapa “'+map().nome+'”?')){world.maps.splice(cur,1);cur=0;undo=[];save();lista();draw()}
  };
  $('#mp-bx').onclick=function(){
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(world)],{type:'application/json'}));
    a.download='mundo.json';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);
  };
  $('#mp-bi').onclick=function(){$('#mp-fi').click()};
  $('#mp-fi').onchange=function(){
    var f=this.files[0];if(!f)return;var r=new FileReader();
    r.onload=function(){try{var w=JSON.parse(r.result);if(!w.maps||!w.maps.length)throw 0;world=w;cur=0;undo=[];save();lista();draw()}catch(e){alert('Arquivo de mundo inválido.')}};
    r.readAsText(f);this.value='';
  };
  $('#mp-bp').onclick=function(){setPlay(!play)};
  document.addEventListener('keydown',onKey);document.addEventListener('keyup',onKeyUp);window.addEventListener('resize',draw);
  pal();busca();lista();
  if(window.MONSTERS_READY)window.MONSTERS_READY.then(function(){if(R)busca()});
  if(play){setPlay(true)}else{setTool(tool);draw()}
}
function unmount(){
  document.removeEventListener('keydown',onKey);document.removeEventListener('keyup',onKeyUp);window.removeEventListener('resize',draw);
  play=false;R=null;cv=null;cx=null;
}
window.MapEditor={mount:mount,unmount:unmount};
})();
