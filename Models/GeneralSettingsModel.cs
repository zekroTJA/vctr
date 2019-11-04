﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace slms2asp.Models
{
    public class GeneralSettingsModel
    {
        [Key]
        [IgnoreDataMember]
        public int Key { get; set; } = 0;

        public string PasswordHash { get; set; }

        [IgnoreDataMember]
        public string DefaultRedirect { get; set; }
    }

    public class GeneralSettingsPostModel
    {
        public string Password;
        public string DefaultRedirect;
    }
}