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
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      admin: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      crate: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      vetCharges: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      usdaCharges: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      groundOrigin: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      boardingOrigin: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      boardingStop: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      boardingArrival: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      groundArrival: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      importPermit: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      customClearance: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        included: {
          type: Boolean,
          required: true
        }
      },
      total: {
        cost: {
          type: Number,
          required: true
        },
        margin: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
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