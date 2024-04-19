export const splitIntoLabelAndType = function(dynamicArray) {
    return dynamicArray.map(item => {
      // Split the string by space
      const words = item.split(' ');
  
      // Extract the last two words as type
      const type = words.slice(-2).join(' ');
  
      // The label is the rest of the words except the last two joined by space
      const label = words.slice(0, -2).join(' ');
  
      return { label, type };
    });
  }
