!function(){var e=[window.Element,window.CharacterData,window.DocumentType],o=[];e.forEach(function(e){e&&o.push(e.prototype)}),o.forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){this.parentNode.removeChild(this)}})})}();
