﻿using DatabaseAccessLayer.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RESTAPI.Models
{
    public class UserCreateModel
    {
        [Required]
        [RegularExpression(Constants.RegexUserName)]
        [StringLength(128, MinimumLength = 4)]
        [JsonPropertyName("username")]
        public string UserName { get; set; }

        [Required]
        [StringLength(1024, MinimumLength = 6)]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [JsonPropertyName("permissions")]
        public Permissions Permissions { get; set; }
    }
}
