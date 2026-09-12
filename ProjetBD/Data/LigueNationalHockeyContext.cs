using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using projetWeb.Models;

namespace projetWeb.Data;

public partial class LigueNationalHockeyContext : DbContext
{
    public LigueNationalHockeyContext()
    {
    }

    public LigueNationalHockeyContext(DbContextOptions<LigueNationalHockeyContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Adresse> Adresses { get; set; }

    public virtual DbSet<Changelog> Changelogs { get; set; }

    public virtual DbSet<Equipe> Equipes { get; set; }

    public virtual DbSet<Gardien> Gardiens { get; set; }

    public virtual DbSet<Joueur> Joueurs { get; set; }

    public virtual DbSet<Match> Matches { get; set; }

    public virtual DbSet<NumeroTelephone> NumeroTelephones { get; set; }

    public virtual DbSet<Statistique> Statistiques { get; set; }

    public virtual DbSet<Utilisateur> Utilisateurs { get; set; }

    public virtual DbSet<VwStatistiquesJoueursParEquipe> VwStatistiquesJoueursParEquipes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=LigueNationalHockey");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Adresse>(entity =>
        {
            entity.HasKey(e => e.AdresseId).HasName("PK_Adresse_AdresseID");
        });

        modelBuilder.Entity<Changelog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__changelo__3213E83FE396F677");

            entity.Property(e => e.InstalledOn).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Equipe>(entity =>
        {
            entity.HasKey(e => e.EquipeId).HasName("PK_Equipe_EquipeID");

            entity.Property(e => e.ButsContre).HasDefaultValue(0);
            entity.Property(e => e.ButsPour).HasDefaultValue(0);
            entity.Property(e => e.DifferentielButs).HasComputedColumnSql("([butsPour]-[butsContre])", false);
        });

        modelBuilder.Entity<Gardien>(entity =>
        {
            entity.HasKey(e => e.GardienId).HasName("PK_Gardien_GardienID");

            entity.Property(e => e.GardienId).ValueGeneratedNever();

            entity.HasOne(d => d.GardienNavigation).WithOne(p => p.Gardien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Gardien_GardienID");
        });

        modelBuilder.Entity<Joueur>(entity =>
        {
            entity.HasKey(e => e.JoueurId).HasName("PK_Joueur_JoueurID");

            entity.Property(e => e.Identifiant).HasDefaultValueSql("(newid())");

            entity.HasOne(d => d.Adresse).WithMany(p => p.Joueurs).HasConstraintName("FK_Joueur_AdresseID");

            entity.HasOne(d => d.Equipe).WithMany(p => p.Joueurs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Joueur_EquipeID");

            entity.HasOne(d => d.NumeroTelephone).WithMany(p => p.Joueurs).HasConstraintName("FK_Joueur_NumeroTelephoneID");
        });

        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId).HasName("PK_Match_MatchID");

            entity.HasOne(d => d.EquipeLocalNavigation).WithMany(p => p.MatchEquipeLocalNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Match_EquipeLocal");

            entity.HasOne(d => d.EquipeVisiteurNavigation).WithMany(p => p.MatchEquipeVisiteurNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Match_EquipeVisiteur");
        });

        modelBuilder.Entity<NumeroTelephone>(entity =>
        {
            entity.HasKey(e => e.NumeroTelephoneId).HasName("PK_NumeroTelephone_NumeroTelephoneID");
        });

        modelBuilder.Entity<Statistique>(entity =>
        {
            entity.HasKey(e => e.StatistiqueId).HasName("PK_Statistique_StatistiqueID");

            entity.HasOne(d => d.Joueur).WithMany(p => p.Statistiques)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Statistique_JoueurID");

            entity.HasOne(d => d.Match).WithMany(p => p.Statistiques)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Statistique_MatchID");
        });

        modelBuilder.Entity<Utilisateur>(entity =>
        {
            entity.HasKey(e => e.UtilisateurId).HasName("PK_Utilisateur_UtilisateurID");
        });

        modelBuilder.Entity<VwStatistiquesJoueursParEquipe>(entity =>
        {
            entity.ToView("VwStatistiquesJoueursParEquipe", "Hockey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
