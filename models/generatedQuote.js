const mongoose = require('mongoose');

const generatedQuoteSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  quotes:[{
    quoteId: {
      type: Number,
      required: true
    },
    quoteLeadId: {
      type: Number,
      required: true
    },
    status:{
      type: String,
      required: true
    },
  
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    routing: {
      from: {
        type: String,
        required: true
      },
      via1: String,
      via2: String,
      to: {
        type: String,
        required: true
      }
    },
    pets: [{
      petNumber: {
        type: Number,
        required: true
      },
      petName: {
        type: String,
        required: false
      },
      dimensions: {
        length: {
          type: String,
          required: true
        },
        width: {
          type: String,
          required: true
        },
        height: {
          type: String,
          required: true
        }
      },
      chargedKg: {
        type: String,
        required: true
      }
    }],
    totalChargedKgs: {
      type: Number,
      required: true
    },
    rates: {
      ratePerKg: {
        type: Number,
        required: true
      },
      airCargoCharges: {
        type: Number,
        required: true
      },
      airlineOtherCharges: {
        type: Number,
        required: true
      },
      airlineTotalCharges: {
        type: Number,
        required: true
      }
    },
    categories: {
      airline: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      admin: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      crate: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      vetCharges: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      usdaCharges: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      groundOrigin: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      boardingOrigin: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      boardingStop: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      boardingArrival: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      groundArrival: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      importPermit: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      customClearance: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        },
        included: {
          type: Boolean,
          required: false
        }
      },
      total: {
        cost: {
          type: Number,
          required: false
        },
        margin: {
          type: Number,
          required: false
        },
        price: {
          type: Number,
          required: false
        }
      }
    },
    comments:{
      type: String,
      required: false
    }}
  ]
});

const generatedQuoteModel = mongoose.model('generatedQuote', generatedQuoteSchema);

module.exports = generatedQuoteModel;