export const activities = {
  shapes: {title:'Shape beds', short:'Match', prompt:'Find the same shape.', summary:'You explored circles, squares and triangles.', next:'Look for a circle on a large plate, then a square on a book.'},
  sorting: {title:'Colour baskets', short:'Sort', prompt:'Tap a flower. Tap its matching basket.', summary:'You put flowers into matching colour groups.', next:'Sort large paper flowers into two colour groups. Add dots and stripes as clues.'},
  counting: {title:'Growing together', short:'Count', prompt:'Tap to count. Then grow the same number.', summary:'You counted little groups and made a matching group.', next:'Count up to three large blocks, then spread them out and count again.'}
};
export const shapeRounds = [
  {target:'circle', options:['square','circle','triangle'], vary:false},
  {target:'square', options:['triangle','circle','square'], vary:false},
  {target:'triangle', options:['triangle','square','circle'], vary:false},
  {target:'square', options:['circle','square','triangle'], vary:true}
];
export const sortRounds = [ ['red','blue','red'], ['blue','red','blue'] ];
export const countRounds = [1,2,3];
export const numberWords = ['none','one','two','three'];
export const shapeHints = {circle:'A circle is round, with no corners.', square:'A square has four equal straight sides and four square corners.', triangle:'A triangle has three straight sides and three corners.'};
