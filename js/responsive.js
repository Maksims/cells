function responsive(list) {
  this.body = $('body');
  this.ruler = $('<div style="width:100%;height:0;" />');
  this.body.prepend(this.ruler);

  this.width = this.ruler.width();
  this.state = 0;
  this.list = list;
  this.update();

  var self = this;
  $(window).bind('resize orientationchange', function() {
    self.update();
  });
}
responsive.prototype.update = function() {
  this.width = this.ruler.width();

  if (this.list !== undefined) {
    var oldState = this.state;
    for(var i = 0, len = this.list.length; i < len; ++i) {
      if (this.width >= this.list[i].width) {
        this.state = this.list[i].style;
        break;
      }
    }
    if (oldState != this.state) {
      var style = 'state' + this.state;
      for(var i = 0, len = this.list.length; i < len; ++i) {
        if (this.width < this.list[i].width || this.state == this.list[i].style) {
          style += ' stateLess' + this.list[i].style;
        } else {
          style += ' stateMore' + this.list[i].style;
        }
      }
      this.body.attr('class', style);
      $(this).trigger('res.change');
    }
  }
  $(this).trigger('res.resize');
}
responsive.prototype.set = function(width) {
  if (width) {
    $('html').css('width', width);
  } else {
    $('html').css('width', '');
  }
  this.update();
}
responsive.prototype.change = function(func) {
  $(this).bind('res.change', func);
  func.apply(this);
}
responsive.prototype.resize = function(func) {
  $(this).bind('res.resize', func);
  func.apply(this);
}